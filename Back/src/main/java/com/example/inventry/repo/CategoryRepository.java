package com.example.inventry.repo;

import com.example.inventry.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
    // Custom query methods if needed
}
