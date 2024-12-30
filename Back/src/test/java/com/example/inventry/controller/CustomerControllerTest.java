package com.example.inventry.controller;

import com.example.inventry.entity.Customer;
import com.example.inventry.service.CustomerServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CustomerControllerTest {

    @InjectMocks
    private CustomerController customerController;

    @Mock
    private CustomerServices customerServices;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(customerController).build();
    }

    @Test
    void testSaveCustomer() throws Exception {
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", "john@example.com", "password123");

        doNothing().when(customerServices).saveorUpdate(any(Customer.class));

        mockMvc.perform(post("/api/v1/details/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "_id": "1",
                                "customerfirstname": "John",
                                "customerlastname": "Doe",
                                "customeraddress": "123 Street",
                                "mobile": "1234567890",
                                "email": "john@example.com",
                                "password": "password123"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));

        verify(customerServices, times(1)).saveorUpdate(any(Customer.class));
    }

    @Test
    void testGetUsers() throws Exception {
        Customer customer = new Customer("1", "John", "Doe", "123 Street", "1234567890", "john@example.com", "password123");
        when(customerServices.listAll()).thenReturn(List.of(customer));

        mockMvc.perform(get("/api/v1/details/getall"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]._id", is("1")))
                .andExpect(jsonPath("$[0].customerfirstname", is("John")))
                .andExpect(jsonPath("$[0].customerlastname", is("Doe")))
                .andExpect(jsonPath("$[0].customeraddress", is("123 Street")))
                .andExpect(jsonPath("$[0].mobile", is("1234567890")))
                .andExpect(jsonPath("$[0].email", is("john@example.com")));

        verify(customerServices, times(1)).listAll();
    }

    @Test
    void testUpdateCustomer() throws Exception {
        Customer updatedCustomer = new Customer("1", "John Updated", "Doe", "456 Avenue", "9876543210", "john.updated@example.com", "newpassword");

        doNothing().when(customerServices).saveorUpdate(any(Customer.class));

        mockMvc.perform(put("/api/v1/details/edit/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "customerfirstname": "John Updated",
                                "customerlastname": "Doe",
                                "customeraddress": "456 Avenue",
                                "mobile": "9876543210",
                                "email": "john.updated@example.com",
                                "password": "newpassword"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerfirstname", is("John Updated")))
                .andExpect(jsonPath("$.email", is("john.updated@example.com")));

        verify(customerServices, times(1)).saveorUpdate(any(Customer.class));
    }

    @Test
    void testDeleteCustomer() throws Exception {
        doNothing().when(customerServices).deleteCustomer("1");

        mockMvc.perform(delete("/api/v1/details/delete/1"))
                .andExpect(status().isOk());

        verify(customerServices, times(1)).deleteCustomer("1");
    }

    @Test
    void testSignup() throws Exception {
        when(customerServices.existsByEmail("jane@example.com")).thenReturn(false);

        doNothing().when(customerServices).saveorUpdate(any(Customer.class));

        mockMvc.perform(post("/api/v1/details/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "_id": "2",
                                "customerfirstname": "Jane",
                                "customerlastname": "Doe",
                                "customeraddress": "789 Boulevard",
                                "mobile": "1231231234",
                                "email": "jane@example.com",
                                "password": "password456"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(content().string("Signup successful!"));

        verify(customerServices, times(1)).saveorUpdate(any(Customer.class));
    }

    @Test
    void testLogin() throws Exception {
        Customer existingCustomer = new Customer("1", "John", "Doe", "123 Street", "1234567890", "john@example.com", "password123");

        when(customerServices.getByEmail("john@example.com")).thenReturn(existingCustomer);

        mockMvc.perform(post("/api/v1/details/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "email": "john@example.com",
                                "password": "password123"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(content().string("Login successful!"));

        verify(customerServices, times(1)).getByEmail("john@example.com");
    }
}
