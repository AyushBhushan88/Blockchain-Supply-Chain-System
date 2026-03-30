package com.supplychain.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductHistoryResponse {
    private String status;
    private String actor;
    private String metadata;
    private LocalDateTime timestamp;
}
