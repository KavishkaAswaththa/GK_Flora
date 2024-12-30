package com.example.inventry.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CorsConfig.class)
class CorsConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        // Initialize MockMvc before each test
    }

    @Test
    void corsHeaders_shouldBePresent() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.options("/api/test") // Simulate a preflight CORS request
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("GET")))
                .andExpect(header().string("Access-Control-Expose-Headers", containsString("X-ID")));
    }

    @Test
    void corsHeaders_shouldNotBePresentForUnauthorizedOrigin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.options("/api/test") // Simulate a preflight CORS request
                        .header("Origin", "http://unauthorized-origin.com")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden());
    }

    @Test
    void corsHeaders_shouldBePresentForGetRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/test")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isNotFound()) // Assuming "/api/test" does not exist
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
