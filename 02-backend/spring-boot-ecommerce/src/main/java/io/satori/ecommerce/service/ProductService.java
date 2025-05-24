package io.satori.ecommerce.service;

import io.satori.ecommerce.dao.ProductCategoryRepository;
import io.satori.ecommerce.dao.ProductRepository;
import io.satori.ecommerce.dto.ProductRequest;
import io.satori.ecommerce.entity.Product;
import io.satori.ecommerce.entity.ProductCategory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                         ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(ProductRequest productRequest) {
        Product product = new Product();
        updateProductFromRequest(product, productRequest);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Product not found with id: " + id));
        
        updateProductFromRequest(product, productRequest);
        return productRepository.save(product);
    }

    private void updateProductFromRequest(Product product, ProductRequest request) {
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnitPrice(request.getUnitPrice());
        product.setActive(request.isActive());
        product.setUnitsInStock(request.getUnitsInStock());

        // Only update imageUrl if a new one is provided
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        if (request.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                            "Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }
    }
}