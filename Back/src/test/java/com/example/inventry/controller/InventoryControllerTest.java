package com.example.inventry.controller;

import com.example.inventry.entity.Inventory;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventoryController.class)
public class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryService inventoryService;

    @MockBean
    private ImageService imageService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSaveInventoryWithImages() throws Exception {
        MockMultipartFile file = new MockMultipartFile("files", "image.jpg", "image/jpeg", "test image content".getBytes());

        Mockito.when(imageService.uploadImages(any())).thenReturn(List.of("imageId1"));
        Mockito.doNothing().when(inventoryService).save(any(Inventory.class));

        mockMvc.perform(multipart("/api/inventory/save")
                        .file(file)
                        .param("name", "Test Bouquet")
                        .param("category", "Flowers")
                        .param("description", "Beautiful bouquet")
                        .param("price", "20.5")
                        .param("bloomContains", "Roses, Lilies"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetInventoryById() throws Exception {
        Inventory inventory = new Inventory("1", "Test Bouquet", "Flowers", "Beautiful bouquet", 20.5, "Roses, Lilies", List.of("imageId1"));
        Mockito.when(inventoryService.getById("1")).thenReturn(inventory);
        Mockito.when(imageService.getImageById("imageId1")).thenReturn("test image data".getBytes());

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Test Bouquet"));
    }

    @Test
    public void testGetAllInventories() throws Exception {
        Inventory inventory = new Inventory("1", "Test Bouquet", "Flowers", "Beautiful bouquet", 20.5, "Roses, Lilies", List.of("imageId1"));
        List<Inventory> inventories = List.of(inventory);
        Mockito.when(inventoryService.getAllInventories()).thenReturn(inventories);

        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Test Bouquet"));
    }

    @Test
    public void testDeleteInventory() throws Exception {
        Mockito.when(inventoryService.deleteById("1")).thenReturn(true);

        mockMvc.perform(delete("/api/inventory/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Inventory with ID 1 deleted successfully."));
    }
}