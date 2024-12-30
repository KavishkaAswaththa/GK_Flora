package com.example.inventry.service;

import com.example.inventry.entity.Customer;
import com.example.inventry.repo.CustomerRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerServicesTest {

    @InjectMocks
    private CustomerServices customerServices;

    @Mock
    private CustomerRepo customerRepo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveOrUpdate() {
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", "john@example.com", "password123");

        customerServices.saveorUpdate(customer);

        verify(customerRepo, times(1)).save(customer);
    }

    @Test
    void testListAll() {
        customerServices.listAll();

        verify(customerRepo, times(1)).findAll();
    }

    @Test
    void testDeleteCustomer() {
        String customerId = "1";

        customerServices.deleteCustomer(customerId);

        verify(customerRepo, times(1)).deleteById(customerId);
    }

    @Test
    void testGetCustomerByID() {
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", "john@example.com", "password123");

        when(customerRepo.findById("1")).thenReturn(Optional.of(customer));

        Customer result = customerServices.getCustomerByID("1");

        assertNotNull(result);
        assertEquals("John", result.getCustomerfirstname());
        assertEquals("Doe", result.getCustomerlastname());

        verify(customerRepo, times(1)).findById("1");
    }

    @Test
    void testExistsByEmailWhenEmailExists() {
        String email = "john@example.com";
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", email, "password123");

        when(customerRepo.findByEmail(email)).thenReturn(customer);

        boolean exists = customerServices.existsByEmail(email);

        assertTrue(exists);

        verify(customerRepo, times(1)).findByEmail(email);
    }

    @Test
    void testExistsByEmailWhenEmailDoesNotExist() {
        String email = "nonexistent@example.com";

        when(customerRepo.findByEmail(email)).thenReturn(null);

        boolean exists = customerServices.existsByEmail(email);

        assertFalse(exists);

        verify(customerRepo, times(1)).findByEmail(email);
    }

    @Test
    void testGetByEmail() {
        String email = "john@example.com";
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", email, "password123");

        when(customerRepo.findByEmail(email)).thenReturn(customer);

        Customer result = customerServices.getByEmail(email);

        assertNotNull(result);
        assertEquals("John", result.getCustomerfirstname());
        assertEquals(email, result.getEmail());

        verify(customerRepo, times(1)).findByEmail(email);
    }
}
