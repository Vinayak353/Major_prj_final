package com.bikeparts.controller;

import com.bikeparts.model.Order;
import com.bikeparts.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders
     * Place a new Cash-on-Delivery order.
     *
     * Request body:
     * {
     *   "shippingAddress": "Rahul Sharma\n123 Main St\nSolapur, Maharashtra - 413001\nPhone: 9876543210",
     *   "items": [
     *     { "productId": 3, "quantity": 2 },
     *     { "productId": 7, "quantity": 1 }
     *   ]
     * }
     *
     * Response: { "orderId": 42, "message": "Order placed successfully", "status": "PENDING" }
     */
    @PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        try {
            Order order = orderService.createOrder(body, auth.getName());
            return ResponseEntity.ok(Map.of(
                    "orderId",  order.getId(),
                    "message",  "Order placed successfully",
                    "status",   order.getStatus().name(),
                    "total",    order.getTotalAmount()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * GET /api/orders
     * Returns the authenticated user's orders (with items + product details).
     */
    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
    }

    /**
     * GET /api/orders/{id}
     * Returns a single order. User can only see their own; admin sees any.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id, auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * PUT /api/orders/{id}/cancel
     * Cancel an order (only PENDING or CONFIRMED orders can be cancelled).
     * Stock is restored automatically.
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            Authentication auth) {
        try {
            Order cancelled = orderService.cancelOrder(id, auth.getName());
            return ResponseEntity.ok(Map.of(
                    "orderId", cancelled.getId(),
                    "status",  cancelled.getStatus().name(),
                    "message", "Order cancelled successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}