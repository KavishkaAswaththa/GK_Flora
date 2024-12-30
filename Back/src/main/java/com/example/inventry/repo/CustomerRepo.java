package com.example.inventry.repo;

import com.example.inventry.entity.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends MongoRepository<Customer, String> {

    // Custom query method to find a customer by email
    Customer findByEmail(String email);
}
