package com.example.inventry.repo;

import com.example.inventry.entity.LoyaltyCustomer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LoyaltyRepository extends MongoRepository<LoyaltyCustomer, String> {
    List<LoyaltyCustomer> findByEmailContainingIgnoreCaseOrIdContaining(String email, String id);
}
