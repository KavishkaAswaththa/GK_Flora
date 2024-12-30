package com.example.inventry.controller;

import com.example.inventry.entity.Delivery;
import com.example.inventry.service.DeliveryServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DeliveryControllerTest {

    @InjectMocks
    private DeliveryController deliveryController;

    @Mock
    private DeliveryServices deliveryServices;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(deliveryController).build();
    }

    @Test
    void testSaveDelivery() throws Exception {
        String deliveryJson = """
                {
                    "_id": "1",
                    "delivername": "John Doe",
                    "deliverphone": "1234567890",
                    "address": "123 Street",
                    "city": "New York",
                    "deliveryDate": "2024-12-01",
                    "deliveryTime": "10:00 AM"
                }
                """;

        doNothing().when(deliveryServices).saveorUpdate(any(Delivery.class));

        mockMvc.perform(post("/api/v1/delivery/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveryJson))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));

        verify(deliveryServices, times(1)).saveorUpdate(any(Delivery.class));
    }

    @Test
    void testSavePersonDelivery() throws Exception {
        String deliveryJson = """
                {
                    "_id": "2",
                    "delivername": "Jane Smith",
                    "deliverphone": "0987654321",
                    "address": "456 Avenue",
                    "city": "Los Angeles",
                    "deliveryDate": "2024-12-05",
                    "deliveryTime": "2:00 PM"
                }
                """;

        doNothing().when(deliveryServices).saveorUpdateadmin(any(Delivery.class));

        mockMvc.perform(post("/api/v1/delivery/saveperson")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveryJson))
                .andExpect(status().isOk())
                .andExpect(content().string("2"));

        verify(deliveryServices, times(1)).saveorUpdateadmin(any(Delivery.class));
    }

    @Test
    void testGetAllDeliveries() throws Exception {
        Delivery delivery1 = new Delivery();
        delivery1.set_id("1");
        delivery1.setDelivername("John Doe");

        Delivery delivery2 = new Delivery();
        delivery2.set_id("2");
        delivery2.setDelivername("Jane Smith");

        when(deliveryServices.listAll()).thenReturn(Arrays.asList(delivery1, delivery2));

        mockMvc.perform(get("/api/v1/delivery/getall"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]._id").value("1"))
                .andExpect(jsonPath("$[0].delivername").value("John Doe"))
                .andExpect(jsonPath("$[1]._id").value("2"))
                .andExpect(jsonPath("$[1].delivername").value("Jane Smith"));

        verify(deliveryServices, times(1)).listAll();
    }

    @Test
    void testUpdateDelivery() throws Exception {
        String updateJson = """
                {
                    "delivername": "Updated Name",
                    "deliverphone": "9999999999",
                    "address": "Updated Address",
                    "city": "Updated City",
                    "deliveryDate": "2024-12-10",
                    "deliveryTime": "3:00 PM"
                }
                """;

        doNothing().when(deliveryServices).saveorUpdate(any(Delivery.class));

        mockMvc.perform(put("/api/v1/delivery/edit/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.delivername").value("Updated Name"))
                .andExpect(jsonPath("$.deliverphone").value("9999999999"));

        verify(deliveryServices, times(1)).saveorUpdate(any(Delivery.class));
    }

    @Test
    void testDeleteDelivery() throws Exception {
        doNothing().when(deliveryServices).deleteDelivery("1");

        mockMvc.perform(delete("/api/v1/delivery/delete/1"))
                .andExpect(status().isOk());

        verify(deliveryServices, times(1)).deleteDelivery("1");
    }
}
