package com.example.inventry.controller;

import com.example.inventry.entity.Inventory;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.InventoryService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
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

    public InventoryControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveInventoryWithImage_shouldReturnSuccess() throws Exception {
        // Mock input
        MockMultipartFile file = new MockMultipartFile("file", "image.jpg", "image/jpeg", "dummy image data".getBytes());
        String id = "1";
        String name = "Test Item";
        String category = "Test Category";
        String description = "Test Description";
        Double price = 100.0;
        int qty = 10;

        // Mock services
        ObjectId objectId = new ObjectId();
        when(imageService.uploadImage(file)).thenReturn(objectId);
        doNothing().when(inventoryService).save(any(Inventory.class));

        // Execute
        ResponseEntity<String> response = inventoryController.saveInventoryWithImage(file, id, name, category, description, price, qty);

        // Verify
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Inventory saved successfully"));
        verify(imageService, times(1)).uploadImage(file);
        verify(inventoryService, times(1)).save(any(Inventory.class));
    }

    @Test
    void saveInventoryWithImage_shouldHandleIOException() throws Exception {
        // Mock input
        MockMultipartFile file = new MockMultipartFile("file", "image.jpg", "image/jpeg", "dummy image data".getBytes());
        String id = "1";
        String name = "Test Item";
        String category = "Test Category";
        String description = "Test Description";
        Double price = 100.0;
        int qty = 10;

        // Mock services
        when(imageService.uploadImage(file)).thenThrow(IOException.class);

        // Execute
        ResponseEntity<String> response = inventoryController.saveInventoryWithImage(file, id, name, category, description, price, qty);

        // Verify
        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Failed to save inventory!", response.getBody());
    }

    @Test
    void getImage_shouldReturnImageWithHeaders() throws Exception {
        // Mock input
        String id = "1";
        byte[] imageData = "dummy image data".getBytes();
        Inventory inventory = new Inventory();
        inventory.set_id(id);
        inventory.setName("Test Item");
        inventory.setCategory("Test Category");
        inventory.setDescription("Test Description");
        inventory.setPrice(100.0);
        inventory.setQty(10);

        // Mock services
        when(imageService.getStudentByID(id)).thenReturn("imageId");
        when(imageService.getImageById("imageId")).thenReturn(imageData);
        when(inventoryService.getById(id)).thenReturn(inventory);

        // Execute
        ResponseEntity<byte[]> response = inventoryController.getImage(id);

        // Verify
        assertEquals(200, response.getStatusCodeValue());
        assertArrayEquals(imageData, response.getBody());
        assertNotNull(response.getHeaders().get("X-ID"));
    }

    @Test
    void getImage_shouldReturnNotFound() throws Exception {
        // Mock input
        String id = "1";

        // Mock services
        when(imageService.getStudentByID(id)).thenThrow(RuntimeException.class);

        // Execute
        ResponseEntity<byte[]> response = inventoryController.getImage(id);

        // Verify
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void getAllItems_shouldReturnAllItems() throws Exception {
        // Mock input
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");
        inventory.setCategory("Test Category");
        inventory.setDescription("Test Description");
        inventory.setPrice(100.0);
        inventory.setQty(10);

        List<Inventory> inventoryList = List.of(inventory);
        byte[] imageData = "dummy image data".getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageData);

        // Mock services
        when(inventoryService.getAllInventories()).thenReturn(inventoryList);
        when(imageService.getStudentByID("1")).thenReturn("imageId");
        when(imageService.getImageById("imageId")).thenReturn(imageData);

        // Execute
        ResponseEntity<List<Map<String, Object>>> response = inventoryController.getAllItems();

        // Verify
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(base64Image, response.getBody().get(0).get("image"));
    }

    @Test
    void deleteInventory_shouldReturnSuccess() throws Exception {
        // Mock input
        String id = "1";

        // Mock services
        when(inventoryService.deleteById(id)).thenReturn(true);

        // Execute
        ResponseEntity<String> response = inventoryController.deleteInventory(id);

        // Verify
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("deleted successfully"));
    }

    @Test
    void deleteInventory_shouldReturnNotFound() throws Exception {
        // Mock input
        String id = "1";

        // Mock services
        when(inventoryService.deleteById(id)).thenReturn(false);

        // Execute
        ResponseEntity<String> response = inventoryController.deleteInventory(id);

        // Verify
        assertEquals(404, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("not found"));
    }
}
