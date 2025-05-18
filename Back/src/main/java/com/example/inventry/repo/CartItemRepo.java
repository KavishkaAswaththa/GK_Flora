package com.example.inventry.repo;

import com.example.inventry.entity.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartItemRepo extends MongoRepository<CartItem, String> {
}
