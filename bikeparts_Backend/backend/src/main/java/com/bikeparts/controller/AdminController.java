package com.bikeparts.controller;

import com.bikeparts.model.Order;
import com.bikeparts.model.User;
import com.bikeparts.repository.OrderRepository;
import com.bikeparts.repository.ProductRepository;
import com.bikeparts.repository.UserRepository;
import com.bikeparts.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService      orderService;
    private final OrderRepository   orderRepository;
    private final UserRepository    userRepository;
    private final ProductRepository productRepository;

    // ── ORDERS ────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/orders
     * All orders with user info + items + product details. Newest first.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * Body: { "status": "SHIPPED" }
     * Valid values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        try {
            return ResponseEntity.ok(orderService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── USERS ─────────────────────────────────────────────────────────────────

    /** GET /api/admin/users */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /** PUT /api/admin/users/{id}/toggle — enable / disable user */
    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<?> toggleUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Field is Boolean (wrapper), so Lombok generates getActive(), not isActive()
            Boolean current = user.getActive();
            user.setActive(current == null || !current);
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DASHBOARD STATS ───────────────────────────────────────────────────────

    /**
     * GET /api/admin/stats
     * Returns counts and revenue for the dashboard cards.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalOrders    = orderRepository.count();
        long pendingOrders  = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long totalUsers     = userRepository.count();
        long totalProducts  = productRepository.count();
        long lowStock       = productRepository.countByStockLessThanEqual(5);
        BigDecimal revenue  = orderRepository.sumRevenue();

        return ResponseEntity.ok(Map.of(
                "totalOrders",   totalOrders,
                "pendingOrders", pendingOrders,
                "totalUsers",    totalUsers,
                "totalProducts", totalProducts,
                "lowStock",      lowStock,
                "totalRevenue",  revenue != null ? revenue : BigDecimal.ZERO
        ));
    }
}