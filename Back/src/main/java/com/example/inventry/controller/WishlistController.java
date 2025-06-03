package com.example.inventry.controller;

import com.example.inventry.entity.Wishlist;
import com.example.inventry.service.JwtService;
import com.example.inventry.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/check/{itemId}")
    public ResponseEntity<Boolean> checkWishlist(@PathVariable String itemId, Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(wishlistService.isInWishlist(email, itemId));
    }

    @PostMapping("/add/{itemId}")
    public ResponseEntity<String> addToWishlist(@PathVariable String itemId, Authentication auth) {
        String email = auth.getName();
        wishlistService.addToWishlist(email, itemId);
        return ResponseEntity.ok("Item added to wishlist");
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable String itemId, Authentication auth) {
        String email = auth.getName();
        wishlistService.removeFromWishlist(email, itemId);
        return ResponseEntity.ok("Item removed from wishlist");
    }

    // ✅ Get full wishlist
    @GetMapping("/all")
    public ResponseEntity<List<Wishlist>> getWishlist(@RequestHeader("Authorization") String authHeader) {
        String userEmail = jwtService.extractEmail(authHeader.substring(7));
        List<Wishlist> wishlist = wishlistService.getUserWishlist(userEmail);
        return ResponseEntity.ok(wishlist);
    }

}
