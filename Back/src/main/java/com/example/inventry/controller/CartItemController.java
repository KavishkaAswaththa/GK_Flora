package com.example.inventry.controller;

import com.example.inventry.entity.CartItem;
import com.example.inventry.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    @Autowired
    private CartItemService service;

    @GetMapping
    public List<CartItem> getAllItems() {
        return service.getAllItems();
    }

    @PostMapping("/add")
    public CartItem addItem(@RequestBody CartItem item) {
        return service.addItem(item);
    }

    @PutMapping("/items/{id}")
    public Optional<CartItem> updateQuantity(@PathVariable String id, @RequestBody CartItem updatedItem) {
        return service.updateQuantity(id, updatedItem.getQuantity());
    }

    @DeleteMapping("/items/{id}")
    public void removeItem(@PathVariable String id) {
        service.removeItem(id);
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        service.clearCart();
    }
}
