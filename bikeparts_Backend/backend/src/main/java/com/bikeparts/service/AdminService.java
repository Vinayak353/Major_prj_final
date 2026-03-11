package com.bikeparts.service;

import com.bikeparts.exception.ResourceNotFoundException;
import com.bikeparts.model.Order;
import com.bikeparts.model.User;
import com.bikeparts.repository.OrderRepository;
import com.bikeparts.repository.ProductRepository;
import com.bikeparts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

// ─── Admin Service ────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long lowStockProducts = productRepository.countByStockLessThanEqual(5);
        BigDecimal totalRevenue = orderRepository.sumRevenue();

        return Map.of(
                "totalUsers", totalUsers,
                "totalProducts", totalProducts,
                "totalOrders", totalOrders,
                "pendingOrders", pendingOrders,
                "lowStockProducts", lowStockProducts,
                "totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO
        );
    }

    public Page<User> getUsers(String search, int page, int size) {
        if (search.isBlank()) return userRepository.findAll(PageRequest.of(page, size));
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, PageRequest.of(page, size));
    }

    @Transactional
    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setActive(active);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User not found: " + id);
        userRepository.deleteById(id);
    }

//    Added a comment
}



