package com.supplychain.backend.repository;

import com.supplychain.backend.model.ProductHistoryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductHistoryRepository extends MongoRepository<ProductHistoryEntry, String> {
    List<ProductHistoryEntry> findAllByBlockchainIdOrderByTimestampDesc(Long blockchainId);
}
