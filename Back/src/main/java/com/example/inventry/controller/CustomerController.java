package com.example.inventry.controller;

import com.example.inventry.entity.Customer;
import com.example.inventry.service.CustomerServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/details")
public class CustomerController {

    @Autowired
    private CustomerServices customerServices;

    @PostMapping(value = "/save")
    private String saveCustomer(@RequestBody Customer customers) {

        customerServices.saveorUpdate(customers);
        return customers.get_id();
    }

    @GetMapping(value = "/getall")
    public Iterable<Customer> getUsers() {

        return customerServices.listAll();
    }

    @PutMapping(value = "/edit/{id}")
    private Customer update(@RequestBody Customer customer, @PathVariable(name = "id") String _id) {
        customer.set_id(_id);
        customerServices.saveorUpdate(customer);
        return customer;
    }

    @DeleteMapping("/delete/{id}")
    private void deleteCustomer(@PathVariable("id") String _id) {

        customerServices.deleteCustomer(_id);
    }


    @RequestMapping("/search/{id}")
    private Customer getUsers(@PathVariable(name = "id") String customerid) {
        return customerServices.getCustomerByID(customerid);
    }

    // Signup Endpoint
    @PostMapping(value = "/signup")
    public String signup(@RequestBody Customer customer) {
        // Check if the email already exists
        if (customerServices.existsByEmail(customer.getEmail())) {
            return "Email already registered!";
        }
        // Save the new customer to the database
        customerServices.saveorUpdate(customer);
        return "Signup successful!";
    }

    // Login Endpoint
    @PostMapping(value = "/login")
    public String login(@RequestBody Customer customer) {
        // Find the customer by email
        Customer existingCustomer = customerServices.getByEmail(customer.getEmail());

        // Check if the customer exists and the password matches
        if (existingCustomer == null || !existingCustomer.getPassword().equals(customer.getPassword())) {
            return "Invalid email or password!";
        }
        return "Login successful!";
    }
}
