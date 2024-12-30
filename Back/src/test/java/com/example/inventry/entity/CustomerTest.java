package com.example.inventry.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomerTest {

    @Test
    void testDefaultConstructor() {
        Customer customer = new Customer();
        assertNull(customer.get_id());
        assertNull(customer.getCustomerfirstname());
        assertNull(customer.getCustomerlastname());
        assertNull(customer.getCustomeraddress());
        assertNull(customer.getMobile());
        assertNull(customer.getEmail());
        assertNull(customer.getPassword());
    }

    @Test
    void testParameterizedConstructor() {
        Customer customer = new Customer(
                "1",
                "John",
                "Doe",
                "123 Street",
                "1234567890",
                "john@example.com",
                "password123"
        );

        assertEquals("1", customer.get_id());
        assertEquals("John", customer.getCustomerfirstname());
        assertEquals("Doe", customer.getCustomerlastname());
        assertEquals("123 Street", customer.getCustomeraddress());
        assertEquals("1234567890", customer.getMobile());
        assertEquals("john@example.com", customer.getEmail());
        assertEquals("password123", customer.getPassword());
    }

    @Test
    void testSettersAndGetters() {
        Customer customer = new Customer();
        customer.set_id("2");
        customer.setCustomerfirstname("Jane");
        customer.setCustomerlastname("Doe");
        customer.setCustomeraddress("456 Avenue");
        customer.setMobile("9876543210");
        customer.setEmail("jane@example.com");
        customer.setPassword("securepassword");

        assertEquals("2", customer.get_id());
        assertEquals("Jane", customer.getCustomerfirstname());
        assertEquals("Doe", customer.getCustomerlastname());
        assertEquals("456 Avenue", customer.getCustomeraddress());
        assertEquals("9876543210", customer.getMobile());
        assertEquals("jane@example.com", customer.getEmail());
        assertEquals("securepassword", customer.getPassword());
    }

    @Test
    void testToString() {
        Customer customer = new Customer(
                "1",
                "John",
                "Doe",
                "123 Street",
                "1234567890",
                "john@example.com",
                "password123"
        );

        String expected = "Customer{_id='1', customerfirstname='John', customerlastname='Doe', " +
                "customeraddress='123 Street', mobile='1234567890', email='john@example.com', password='password123'}";

        assertEquals(expected, customer.toString());
    }
}

