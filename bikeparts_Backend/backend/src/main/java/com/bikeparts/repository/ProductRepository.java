package com.bikeparts.repository;

import com.bikeparts.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // ── Listing / search ─────────────────────────────────────────────────────

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.modelCompatibility) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findBySearch(@Param("search") String search, Pageable pageable);

    Page<Product> findByCategory(String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.category) = LOWER(:category) AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.modelCompatibility) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findBySearchAndCategory(@Param("search") String search,
                                          @Param("category") String category,
                                          Pageable pageable);

    List<Product> findTop8ByStockGreaterThanOrderByCreatedAtDesc(int stock);

    // ── Stock management (used by OrderService) ──────────────────────────────

    /**
     * Atomically decrement stock.
     * Only decrements if stock >= quantity (prevents going negative).
     * Returns number of rows updated (0 = stock was insufficient).
     */
    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity " +
            "WHERE p.id = :id AND p.stock >= :quantity")
    int decrementStock(@Param("id") Long id, @Param("quantity") int quantity);

    /**
     * Restore stock when order is cancelled.
     */
    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :id")
    void incrementStock(@Param("id") Long id, @Param("quantity") int quantity);

    // ── Admin stats ───────────────────────────────────────────────────────────

    long countByStockLessThanEqual(int stock);

    @Query("SELECT SUM(p.price * p.stock) FROM Product p")
    BigDecimal sumInventoryValue();
}