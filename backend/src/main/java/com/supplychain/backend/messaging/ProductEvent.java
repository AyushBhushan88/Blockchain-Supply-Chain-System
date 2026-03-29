package com.supplychain.backend.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEvent {
    private String eventType; // e.g., "REGISTERED", "STATUS_UPDATED"
    private Long blockchainId;
    private String status;
    private String actor;
    private String metadata;
}
