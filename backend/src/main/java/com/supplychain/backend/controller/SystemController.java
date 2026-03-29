package com.supplychain.backend.controller;

import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/health")
    public ResponseEntity<HealthStatus> checkHealth() {
        String dbStatus = "UP";
        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
        } catch (Exception e) {
            dbStatus = "DOWN: " + e.getMessage();
        }

        return ResponseEntity.ok(HealthStatus.builder()
                .status("UP")
                .database(dbStatus)
                .build());
    }

    @Data
    @Builder
    static class HealthStatus {
        private String status;
        private String database;
    }
}
