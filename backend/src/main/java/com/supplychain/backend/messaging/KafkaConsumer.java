package com.supplychain.backend.messaging;

import com.supplychain.backend.model.ProductHistoryEntry;
import com.supplychain.backend.model.ProductRecord;
import com.supplychain.backend.repository.ProductHistoryRepository;
import com.supplychain.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumer {

    private final ProductRepository productRepository;
    private final ProductHistoryRepository productHistoryRepository;

    @KafkaListener(topics = "supply-chain-events", groupId = "supply-chain-group")
    public void consume(ProductEvent event) {
        log.info("Consumed Kafka event: {} for Product ID: {}", event.getEventType(), event.getBlockchainId());

        productRepository.findByBlockchainId(event.getBlockchainId()).ifPresentOrElse(record -> {
            record.setStatus(event.getStatus());
            record.setCurrentOwner(event.getActor());
            record.setLastUpdated(LocalDateTime.now());
            if (event.getMetadata() != null && !event.getMetadata().isEmpty()) {
                record.setMetadata(event.getMetadata());
            }
            productRepository.save(record);
            log.info("Updated MongoDB record for Product ID: {}", event.getBlockchainId());
        }, () -> {
            // Handle registration of brand new products discovered from blockchain
            if ("REGISTERED".equals(event.getEventType())) {
                ProductRecord newRecord = ProductRecord.builder()
                        .blockchainId(event.getBlockchainId())
                        .status(event.getStatus())
                        .manufacturer(event.getActor())
                        .currentOwner(event.getActor())
                        .metadata(event.getMetadata())
                        .lastUpdated(LocalDateTime.now())
                        .build();
                productRepository.save(newRecord);
                log.info("Created new MongoDB record for Product ID: {} from Blockchain event", event.getBlockchainId());
            } else {
                log.warn("Received status update for untracked Product ID: {}", event.getBlockchainId());
            }
        });

        // Save History Entry
        ProductHistoryEntry historyEntry = ProductHistoryEntry.builder()
                .blockchainId(event.getBlockchainId())
                .status(event.getStatus())
                .actor(event.getActor())
                .metadata(event.getMetadata())
                .timestamp(LocalDateTime.now())
                .build();
        productHistoryRepository.save(historyEntry);
        log.info("Saved history entry for Product ID: {}", event.getBlockchainId());
    }
}
