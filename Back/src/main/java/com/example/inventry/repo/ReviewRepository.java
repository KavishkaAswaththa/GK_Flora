package com.example.inventry.repo;

import com.example.inventry.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByItemId(String itemId);
}
