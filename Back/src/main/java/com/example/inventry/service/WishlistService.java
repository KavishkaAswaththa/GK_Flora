package com.example.inventry.service;

import com.example.inventry.entity.Wishlist;
import com.example.inventry.repo.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public boolean isInWishlist(String email, String itemId) {
        return wishlistRepository.existsByUserEmailAndItemId(email, itemId);
    }

    public void addToWishlist(String email, String itemId) {
        if (!isInWishlist(email, itemId)) {
            wishlistRepository.save(new Wishlist(email, itemId));
        }
    }

    public void removeFromWishlist(String email, String itemId) {
        wishlistRepository.deleteByUserEmailAndItemId(email, itemId);
    }

    public List<Wishlist> getUserWishlist(String userEmail) {
        return wishlistRepository.findByUserEmail(userEmail);
    }
}
