package io.satori.ecommerce.controller;

import io.satori.ecommerce.dto.ProductRequest;
import io.satori.ecommerce.entity.Product;
import io.satori.ecommerce.service.FileStorageService;
import io.satori.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import io.satori.ecommerce.dto.ProductResponse;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin("http://localhost:4200")
public class ProductManagementController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    public ProductManagementController(ProductService productService, FileStorageService fileStorageService) {
        this.productService = productService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(file);
            productRequest.setImageUrl(imageUrl);
        }
        
        Product createdProduct = productService.createProduct(productRequest);
        return ResponseEntity.ok(createdProduct);
    }
@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ProductResponse> updateProduct(
        @PathVariable Long id,
        @ModelAttribute(value = "product") ProductRequest productRequest,
        @RequestParam(value = "file", required = false) MultipartFile file) {

    if (file != null && !file.isEmpty()) {
        // Upload file and store image URL
        String imageUrl = fileStorageService.storeFile(file);
        productRequest.setImageUrl(imageUrl);
    }

    // Make service call to update the product
    Product updatedProduct = productService.updateProduct(id, productRequest);

    // Convert the Product Entity to ProductResponse DTO to avoid exposing circular references
    ProductResponse response = convertToProductResponse(updatedProduct);

    return ResponseEntity.ok(response);
}

// Helper method to prevent exposing entities directly
private ProductResponse convertToProductResponse(Product product) {
    if (product == null) {
        throw new IllegalArgumentException("Product cannot be null");
    }

    ProductResponse response = new ProductResponse();

    // Map fields from the Product entity to ProductResponse
    response.setId(product.getId());
    response.setName(product.getName());
    response.setDescription(product.getDescription());
    response.setPrice(product.getUnitPrice() != null ? product.getUnitPrice().doubleValue() : null); // Safely handle BigDecimal
    response.setImageUrl(product.getImageUrl());
    response.setCategoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null); // Handle null category

    return response;
}
}