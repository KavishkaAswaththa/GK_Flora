package com.example.inventry.service;

import com.example.inventry.entity.LoyaltyCustomer;
import com.example.inventry.repo.LoyaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyRepository repository;

    // Create
    public LoyaltyCustomer createCustomer(LoyaltyCustomer customer) {
        customer.setPoints(0);
        customer.setLevel("Silver");
        return repository.save(customer);
    }

    // Read
    public List<LoyaltyCustomer> getAllCustomers() {
        return repository.findAll();
    }

    public List<LoyaltyCustomer> search(String keyword) {
        return repository.findByEmailContainingIgnoreCaseOrIdContaining(keyword, keyword);
    }

    // Update Purchase
    public LoyaltyCustomer processPurchase(String id, int amount, String itemName) {
        LoyaltyCustomer customer = repository.findById(id).orElseThrow();
        int earnedPoints = amount / 100;
        customer.setPoints(customer.getPoints() + earnedPoints);
        customer.setLastPurchase(itemName);
        customer.setPurchaseDate(LocalDate.now().toString());
        customer.setLevel(determineLevel(customer.getPoints()));
        return repository.save(customer);
    }

    // Update Redeem
    public LoyaltyCustomer redeemPoints(String id, int usedPoints) {
        LoyaltyCustomer customer = repository.findById(id).orElseThrow();
        int updatedPoints = customer.getPoints() - usedPoints;
        customer.setPoints(Math.max(updatedPoints, 0));
        return repository.save(customer);
    }

    // Delete
    public void deleteCustomer(String id) {
        repository.deleteById(id);
    }

    private String determineLevel(int points) {
        if (points > 1500) return "Diamond";
        if (points > 500) return "Platinum";
        if (points > 100) return "Gold";
        return "Silver";
    }

    public Optional<LoyaltyCustomer> getCustomerById(String id) {
        return repository.findById(id);
    }
}
