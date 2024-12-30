package com.example.inventry.service;

import com.example.inventry.entity.Customer;
import com.example.inventry.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerServices {

    @Autowired
    private CustomerRepo repo;

    public void saveorUpdate(Customer customers) {
        repo.save(customers);
    }

    public Iterable<Customer> listAll() {
        return this.repo.findAll();
    }

    public void deleteCustomer(String id) {
        repo.deleteById(id);
    }

    public Customer getCustomerByID(String customerid) {
        return repo.findById(customerid).orElse(null);
    }

    // New method to check if the email exists
    public boolean existsByEmail(String email) {
        return repo.findByEmail(email) != null;
    }

    // New method to retrieve customer by email
    public Customer getByEmail(String email) {
        return repo.findByEmail(email);
    }
}
