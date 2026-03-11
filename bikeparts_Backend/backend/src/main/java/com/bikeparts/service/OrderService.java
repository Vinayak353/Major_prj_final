package com.bikeparts.service;

import com.bikeparts.model.*;
import com.bikeparts.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository     orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository   productRepository;
    private final UserRepository      userRepository;

    private static final BigDecimal GST_RATE = new BigDecimal("0.18");

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE ORDER — Cash on Delivery
    //
    // POST /api/orders
    // Body: { "shippingAddress": "...", "items": [{ "productId": 3, "quantity": 2 }] }
    //
    // Steps:
    //  1. Load user by JWT email
    //  2. Validate stock for every item
    //  3. Calculate subtotal + 18% GST = totalAmount
    //  4. Save Order (get DB id)
    //  5. Save each OrderItem with order reference
    //  6. Atomically decrement product stock
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public Order createOrder(Map<String, Object> body, String userEmail) {
        log.info("createOrder: user={}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        String shippingAddress = (String) body.get("shippingAddress");
        if (shippingAddress == null || shippingAddress.isBlank()) {
            throw new RuntimeException("Shipping address is required");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemList =
                (List<Map<String, Object>>) body.get("items");
        if (itemList == null || itemList.isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // ── Step 1: validate stock & build item data ──────────────────────────
        List<Object[]> validated = new ArrayList<>(); // [product, quantity]
        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map<String, Object> item : itemList) {
            Long productId = Long.valueOf(item.get("productId").toString());
            int  quantity  = Integer.parseInt(item.get("quantity").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            if (product.getStock() < quantity) {
                throw new RuntimeException(
                        "Insufficient stock for '" + product.getName() +
                                "'. Available: " + product.getStock()
                );
            }

            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            validated.add(new Object[]{product, quantity});
        }

        // ── Step 2: compute total with GST ────────────────────────────────────
        BigDecimal gst   = subtotal.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(gst).setScale(2, RoundingMode.HALF_UP);

        // ── Step 3: save Order first (gets DB id) ─────────────────────────────
        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .shippingAddress(shippingAddress)
                .paymentMode("COD")
                .status(Order.OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);   // ← now has id

        // ── Step 4: save OrderItems & decrement stock ─────────────────────────
        List<OrderItem> savedItems = new ArrayList<>();
        for (Object[] row : validated) {
            Product product  = (Product) row[0];
            int     quantity = (int)     row[1];

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .build();

            savedItems.add(orderItemRepository.save(oi));

            // Decrement stock atomically
            int updated = productRepository.decrementStock(product.getId(), quantity);
            if (updated == 0) {
                throw new RuntimeException(
                        "Stock was taken by another order for: " + product.getName()
                );
            }
        }

        order.setItems(savedItems);
        log.info("Order #{} created for user={}, total={}", order.getId(), userEmail, total);
        return order;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET USER'S OWN ORDERS  (GET /api/orders)
    // ─────────────────────────────────────────────────────────────────────────
    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserIdWithItems(user.getId());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET SINGLE ORDER  (GET /api/orders/{id})
    // ─────────────────────────────────────────────────────────────────────────
    public Order getOrderById(Long id, String userEmail) {
        Order order = orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin can see any order; customer can only see their own
        if (user.getRole() != User.Role.ADMIN &&
                !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return order;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CANCEL ORDER  (PUT /api/orders/{id}/cancel)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public Order cancelOrder(Long id, String userEmail) {
        Order order = getOrderById(id, userEmail);

        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        // Restore stock
        order.getItems().forEach(item ->
                productRepository.incrementStock(item.getProduct().getId(), item.getQuantity())
        );

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: GET ALL ORDERS  (GET /api/admin/orders)
    // ─────────────────────────────────────────────────────────────────────────
    public List<Order> getAllOrders() {
        return orderRepository.findAllWithDetails();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: UPDATE ORDER STATUS  (PUT /api/admin/orders/{id}/status)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public Order updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}