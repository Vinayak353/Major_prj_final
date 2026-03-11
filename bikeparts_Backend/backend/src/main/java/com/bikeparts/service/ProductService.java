package com.bikeparts.service;

import com.bikeparts.exception.ResourceNotFoundException;
import com.bikeparts.model.Product;
import com.bikeparts.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getAll(String search, String category, String sort,
                                int page, int size) {
        Sort sorting = Sort.by(Sort.Direction.ASC, "name");
        if (sort != null && sort.contains(",")) {
            String[] parts = sort.split(",");
            String field = parts[0].trim();
            Sort.Direction dir = parts.length > 1 && parts[1].trim().equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            sorting = Sort.by(dir, field);
        }
        Pageable pageable = PageRequest.of(page, size, sorting);

        if (search != null && !search.isBlank() && category != null && !category.isBlank()) {
            return productRepository.findBySearchAndCategory(search, category, pageable);
        } else if (search != null && !search.isBlank()) {
            return productRepository.findBySearch(search, pageable);
        } else if (category != null && !category.isBlank()) {
            return productRepository.findByCategory(category, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional
    public Product create(Map<String, Object> body) {
        Product p = buildFromMap(new Product(), body);
        return productRepository.save(p);
    }

    @Transactional
    public Product update(Long id, Map<String, Object> body) {
        Product p = getById(id);
        buildFromMap(p, body);
        return productRepository.save(p);
    }

    @Transactional
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public java.util.List<Product> getFeatured() {
        return productRepository.findTop8ByStockGreaterThanOrderByCreatedAtDesc(0);
    }

    // ─── Shared helper ────────────────────────────────────────────────────────
    private Product buildFromMap(Product p, Map<String, Object> body) {
        if (body.containsKey("name"))               p.setName((String) body.get("name"));
        if (body.containsKey("brand"))              p.setBrand((String) body.get("brand"));
        if (body.containsKey("category"))           p.setCategory((String) body.get("category"));
        if (body.containsKey("modelCompatibility")) p.setModelCompatibility((String) body.get("modelCompatibility"));
        if (body.containsKey("description"))        p.setDescription((String) body.get("description"));
        if (body.containsKey("imageUrl"))           p.setImageUrl((String) body.get("imageUrl"));
        if (body.containsKey("price"))
            p.setPrice(new BigDecimal(body.get("price").toString()));
        if (body.containsKey("stock"))
            p.setStock(Integer.parseInt(body.get("stock").toString()));
        return p;
    }
}