package com.example.inventry.repo;

import com.example.inventry.entity.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class CustomerRepoTest {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private MongoTemplate mongoTemplate;

    @BeforeEach
    void setUp() {
        // Clean the database before each test
        mongoTemplate.dropCollection(Customer.class);

        // Insert sample data
        Customer customer = new Customer(
                "1",
                "John",
                "Doe",
                "123 Street",
                "1234567890",
                "john@example.com",
                "password123"
        );
        mongoTemplate.save(customer);
    }

    @Test
    void testFindByEmail() {
        // Test finding an existing customer by email
        Customer customer = customerRepo.findByEmail("john@example.com");
        assertNotNull(customer);
        assertEquals("John", customer.getCustomerfirstname());
        assertEquals("Doe", customer.getCustomerlastname());
        assertEquals("123 Street", customer.getCustomeraddress());
        assertEquals("1234567890", customer.getMobile());
        assertEquals("password123", customer.getPassword());

        // Test finding a non-existing customer
        Customer nonExistentCustomer = customerRepo.findByEmail("nonexistent@example.com");
        assertNull(nonExistentCustomer);
    }
}
