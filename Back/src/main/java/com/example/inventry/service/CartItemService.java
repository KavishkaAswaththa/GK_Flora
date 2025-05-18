package com.example.inventry.service;

import com.example.inventry.entity.CartItem;
import com.example.inventry.repo.CartItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepo cartRepo;

    public List<CartItem> getAllItems() {
        return cartRepo.findAll();
    }

    public CartItem addItem(CartItem item) {
        return cartRepo.save(item);
    }

    public Optional<CartItem> updateQuantity(String id, int quantity) {
        return cartRepo.findById(id).map(item -> {
            item.setQuantity(Math.max(1, quantity)); // minimum quantity 1
            return cartRepo.save(item);
        });
    }

    public void removeItem(String id) {
        cartRepo.deleteById(id);
    }

    public void clearCart() {
        cartRepo.deleteAll();
    }
}
