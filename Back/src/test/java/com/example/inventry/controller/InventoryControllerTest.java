package com.example.inventry.controller;

import com.example.inventry.entity.Inventory;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InventoryControllerTest {

    @InjectMocks
    private InventoryController inventoryController;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private ImageService imageService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private Principal principal;

    private final String adminEmail = "gamindumpasan1997@gmail.com";

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        when(principal.getName()).thenReturn(adminEmail);
    }

    @Test
    void testSaveInventoryWithImagesSuccess() throws Exception {
        MockMultipartFile file1 = new MockMultipartFile("files", "flower.jpg", MediaType.IMAGE_JPEG_VALUE, "dummy data".getBytes());
        MultipartFile[] files = new MultipartFile[]{file1};

        String bloomJson = "[\"red\",\"thorny\"]";
        List<String> bloomTags = List.of("red", "thorny");
        List<String> imageIds = List.of("img1");

        when(objectMapper.readValue(bloomJson, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {}))
                .thenReturn(bloomTags);
        when(imageService.uploadImages(files)).thenReturn(imageIds);
        when(inventoryService.save(any(), eq(adminEmail))).thenReturn(true);

        ResponseEntity<String> response = inventoryController.saveInventoryWithImages(
                files,
                "123",
                "Rose",
                "Flower",
                "Red rose flower",
                10.0,
                3,
                bloomJson,
                principal);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Inventory saved successfully"));
    }

    @Test
    void testSaveInventoryWithImagesFileCountInvalid() {
        MultipartFile[] files = new MultipartFile[]{}; // zero files

        ResponseEntity<String> response = inventoryController.saveInventoryWithImages(
                files,
                "123",
                "Rose",
                "Flower",
                "Description",
                10.0,
                3,
                "[]",
                principal);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Please upload between 1 and 6 images.", response.getBody());
    }

    @Test
    void testUpdateQtySuccess() {
        Map<String, Integer> payload = Map.of("qty", 10);

        when(inventoryService.updateQty("123", 10, adminEmail)).thenReturn(true);

        ResponseEntity<String> response = inventoryController.updateQty("123", payload, principal);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Quantity updated successfully.", response.getBody());
    }

    @Test
    void testUpdateQtyFail() {
        Map<String, Integer> payload = Map.of("qty", 10);

        when(inventoryService.updateQty("123", 10, adminEmail)).thenReturn(false);

        ResponseEntity<String> response = inventoryController.updateQty("123", payload, principal);
        assertEquals(403, response.getStatusCodeValue());
        assertEquals("Access denied or item not found.", response.getBody());
    }

    @Test
    void testGetInventoryDetailsFound() throws Exception {
        Inventory inventory = new Inventory();
        inventory.set_id("123");
        inventory.setName("Rose");
        inventory.setCategory("Flower");
        inventory.setDescription("Nice rose");
        inventory.setPrice(12.0);
        inventory.setQty(7);
        inventory.setBloomContains(List.of("red", "thorny"));
        inventory.setImageIds(List.of("img1"));

        when(inventoryService.getById("123")).thenReturn(inventory);
        when(imageService.getImageById("img1")).thenReturn("data".getBytes());

        ResponseEntity<Map<String, Object>> response = inventoryController.getInventoryDetails("123");
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("123", body.get("id"));
        assertTrue(body.containsKey("images"));
    }

    @Test
    void testGetInventoryDetailsNotFound() {
        when(inventoryService.getById("123")).thenReturn(null);
        ResponseEntity<Map<String, Object>> response = inventoryController.getInventoryDetails("123");
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteInventorySuccess() {
        when(inventoryService.deleteById("123", adminEmail)).thenReturn(true);

        ResponseEntity<String> response = inventoryController.deleteInventory("123", principal);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("deleted successfully"));
    }

    @Test
    void testDeleteInventoryFail() {
        when(inventoryService.deleteById("123", adminEmail)).thenReturn(false);

        ResponseEntity<String> response = inventoryController.deleteInventory("123", principal);
        assertEquals(403, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Access denied"));
    }
}
