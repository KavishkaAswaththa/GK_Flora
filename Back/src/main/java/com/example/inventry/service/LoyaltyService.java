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

    // Create a new customer
    public LoyaltyCustomer createCustomer(LoyaltyCustomer customer) {
        customer.setPoints(0);
        customer.setLevel("Silver");
        return repository.save(customer);
    }

    // Get all customers
    public List<LoyaltyCustomer> getAllCustomers() {
        return repository.findAll();
    }

    // Search by email or partial match
    public List<LoyaltyCustomer> search(String keyword) {
        return repository.findByEmailContainingIgnoreCaseOrIdContaining(keyword, keyword);
    }

    // Process purchase using email instead of ID
    public LoyaltyCustomer processPurchaseByEmail(String email, int amount, String itemName) {
        LoyaltyCustomer customer = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));

        int earnedPoints = amount / 100;
        customer.setPoints(customer.getPoints() + earnedPoints);
        customer.setLastPurchase(itemName);
        customer.setPurchaseDate(LocalDate.now().toString());
        customer.setLevel(determineLevel(customer.getPoints()));

        return repository.save(customer);
    }

    // Redeem points using email
    public LoyaltyCustomer redeemPointsByEmail(String email, int usedPoints) {
        LoyaltyCustomer customer = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));

        int updatedPoints = customer.getPoints() - usedPoints;
        customer.setPoints(Math.max(updatedPoints, 0)); // avoid negative points

        return repository.save(customer);
    }

    // Delete by email
    public void deleteCustomerByEmail(String email) {
        repository.findByEmail(email).ifPresent(repository::delete);
    }

    // Get customer by email
    public Optional<LoyaltyCustomer> getCustomerByEmail(String email) {
        return repository.findByEmail(email);
    }

    // Determine membership level
    private String determineLevel(int points) {
        if (points > 1500) return "Diamond";
        if (points > 500) return "Platinum";
        if (points > 100) return "Gold";
        return "Silver";
    }
}
