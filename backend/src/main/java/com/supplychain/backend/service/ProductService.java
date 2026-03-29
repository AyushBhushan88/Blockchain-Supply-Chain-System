package com.supplychain.backend.service;

import com.supplychain.backend.dto.ProductRequest;
import com.supplychain.backend.dto.ProductResponse;
import com.supplychain.backend.exception.ProductNotFoundException;
import com.supplychain.backend.model.ProductRecord;
import com.supplychain.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponse registerProduct(ProductRequest request) {
        ProductRecord record = ProductRecord.builder()
                .blockchainId(request.getBlockchainId())
                .name(request.getName())
                .description(request.getDescription())
                .manufacturer(request.getManufacturerAddress())
                .currentOwner(request.getManufacturerAddress())
                .metadata(request.getInitialMetadata())
                .status("CREATED")
                .lastUpdated(LocalDateTime.now())
                .build();

        ProductRecord saved = productRepository.save(record);
        return mapToResponse(saved);
    }

    public ProductResponse getProductByBlockchainId(Long blockchainId) {
        return productRepository.findByBlockchainId(blockchainId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with blockchain ID: " + blockchainId));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(ProductRecord record) {
        return ProductResponse.builder()
                .id(record.getId())
                .blockchainId(record.getBlockchainId())
                .name(record.getName())
                .description(record.getDescription())
                .status(record.getStatus())
                .manufacturer(record.getManufacturer())
                .currentOwner(record.getCurrentOwner())
                .lastUpdated(record.getLastUpdated())
                .metadata(record.getMetadata())
                .build();
    }
}
