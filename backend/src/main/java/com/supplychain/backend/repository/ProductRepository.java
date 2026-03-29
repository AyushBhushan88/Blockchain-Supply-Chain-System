package com.supplychain.backend.repository;

import com.supplychain.backend.model.ProductRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<ProductRecord, String> {
    Optional<ProductRecord> findByBlockchainId(Long blockchainId);
}
