package com.supplychain.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class ProductRecord {
    @Id
    private String id;
    private Long blockchainId;
    private String metadata;
    private String status;
    private String manufacturer;
    private String currentOwner;
    private LocalDateTime lastUpdated;
}
