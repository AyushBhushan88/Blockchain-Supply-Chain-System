package com.supplychain.backend.controller;

import com.supplychain.backend.dto.ProductRequest;
import com.supplychain.backend.dto.ProductResponse;
import com.supplychain.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> registerProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productService.registerProduct(request), HttpStatus.CREATED);
    }

    @GetMapping("/{blockchainId}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long blockchainId) {
        return ResponseEntity.ok(productService.getProductByBlockchainId(blockchainId));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
