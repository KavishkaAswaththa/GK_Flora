package com.example.inventry.repo;

import com.example.inventry.entity.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserEmail(String userEmail);
    Optional<Wishlist> findByUserEmailAndItemId(String userEmail, String itemId);

    void deleteByUserEmailAndItemId(String userEmail, String itemId);
    boolean existsByUserEmailAndItemId(String userEmail, String itemId);
}
