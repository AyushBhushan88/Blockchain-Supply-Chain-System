package com.supplychain.backend.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

    private static final String TOPIC = "supply-chain-events";
    private final KafkaTemplate<String, ProductEvent> kafkaTemplate;

    public void sendEvent(ProductEvent event) {
        log.info("Publishing event to Kafka: {} for Product ID: {}", event.getEventType(), event.getBlockchainId());
        kafkaTemplate.send(TOPIC, event.getBlockchainId().toString(), event);
    }
}
