package com.example.inventry.repo;

import com.example.inventry.entity.LoyaltyCustomer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LoyaltyRepository extends MongoRepository<LoyaltyCustomer, String> {
    Optional<LoyaltyCustomer> findByEmail(String email);
    List<LoyaltyCustomer> findByEmailContainingIgnoreCaseOrIdContaining(String email, String id);
}
