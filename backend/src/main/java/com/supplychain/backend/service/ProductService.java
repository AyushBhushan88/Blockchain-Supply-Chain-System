package com.supplychain.backend.service;

import com.supplychain.backend.dto.ProductHistoryResponse;
import com.supplychain.backend.dto.ProductRequest;
import com.supplychain.backend.dto.ProductResponse;
import com.supplychain.backend.exception.ProductNotFoundException;
import com.supplychain.backend.model.ProductRecord;
import com.supplychain.backend.repository.ProductHistoryRepository;
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
    private final ProductHistoryRepository productHistoryRepository;

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
        return mapToResponse(saved, false);
    }

    public ProductResponse getProductByBlockchainId(Long blockchainId) {
        return productRepository.findByBlockchainId(blockchainId)
                .map(record -> mapToResponse(record, true))
                .orElseThrow(() -> new ProductNotFoundException("Product not found with blockchain ID: " + blockchainId));
    }

    public List<ProductHistoryResponse> getProductHistory(Long blockchainId) {
        return productHistoryRepository.findAllByBlockchainIdOrderByTimestampDesc(blockchainId).stream()
                .map(entry -> ProductHistoryResponse.builder()
                        .status(entry.getStatus())
                        .actor(entry.getActor())
                        .metadata(entry.getMetadata())
                        .timestamp(entry.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(record -> mapToResponse(record, false))
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(ProductRecord record, boolean includeHistory) {
        ProductResponse response = ProductResponse.builder()
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

        if (includeHistory) {
            response.setHistory(getProductHistory(record.getBlockchainId()));
        }

        return response;
    }
}
