package com.example.inventry.controller;

import com.example.inventry.entity.LoyaltyCustomer;
import com.example.inventry.service.LoyaltyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/customers")
public class LoyaltyController {

    private final LoyaltyService customerService;

    @Autowired
    public LoyaltyController(LoyaltyService customerService) {
        this.customerService = customerService;
    }

    // Create
    @PostMapping
    public LoyaltyCustomer createCustomer(@RequestBody LoyaltyCustomer customer) {
        // Set default values
        customer.setPoints(0);
        customer.setLevel("Silver"); // or your initial level
        customer.setLastPurchase("");
        customer.setPurchaseDate("");

        return customerService.createCustomer(customer);
    }


    // Read All
    @GetMapping
    public List<LoyaltyCustomer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<LoyaltyCustomer> getCustomer(@PathVariable String id) {
        return customerService.getCustomerByEmail(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search
    @GetMapping("/search")
    public List<LoyaltyCustomer> search(@RequestParam("keyword") String keyword) {
        return customerService.search(keyword);
    }

    // Purchase
    @PostMapping("/purchase")
    public LoyaltyCustomer purchaseByEmail(
            @RequestParam("email") String email,
            @RequestParam("amount") int amount,
            @RequestParam("item") String item
    ) {
        return customerService.processPurchaseByEmail(email, amount, item);
    }


    // Redeem Points
    @PostMapping("/{id}/redeem")
    public LoyaltyCustomer redeemPoints(
            @PathVariable("id") String customerId,
            @RequestParam("points") int points) {
        return customerService.redeemPointsByEmail(customerId, points);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomerByEmail(id);
        return ResponseEntity.ok("Customer deleted successfully.");
    }
}
