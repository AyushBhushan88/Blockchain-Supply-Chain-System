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
@Document(collection = "product_history")
public class ProductHistoryEntry {
    @Id
    private String id;
    private Long blockchainId;
    private String status;
    private String actor;
    private String metadata;
    private LocalDateTime timestamp;
}
