package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.InventoryRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InventoryServiceTest {

    @InjectMocks
    private InventoryService inventoryService;

    @Mock
    private InventoryRepo inventoryRepo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveInventory() {
        // Mock an inventory item
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");
        inventory.setCategory("Category A");

        // Call the service method
        inventoryService.save(inventory);

        // Verify that the repository save method is called
        verify(inventoryRepo, times(1)).save(inventory);
    }

    @Test
    void testGetAllInventories() {
        // Mock the repository response
        Inventory inventory1 = new Inventory();
        inventory1.set_id("1");
        inventory1.setName("Item 1");

        Inventory inventory2 = new Inventory();
        inventory2.set_id("2");
        inventory2.setName("Item 2");

        when(inventoryRepo.findAll()).thenReturn(Arrays.asList(inventory1, inventory2));

        // Call the service method
        List<Inventory> result = inventoryService.getAllInventories();

        // Verify results
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Item 1", result.get(0).getName());
        assertEquals("Item 2", result.get(1).getName());
    }

    @Test
    void testGetByIdWhenInventoryExists() {
        // Mock the repository response
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");

        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));

        // Call the service method
        Inventory result = inventoryService.getById("1");

        // Verify results
        assertNotNull(result);
        assertEquals("Test Item", result.getName());
    }

    @Test
    void testGetByIdWhenInventoryDoesNotExist() {
        // Mock the repository response
        when(inventoryRepo.findById("1")).thenReturn(Optional.empty());

        // Call the service method
        Inventory result = inventoryService.getById("1");

        // Verify results
        assertNull(result);
    }

    @Test
    void testDeleteByIdWhenInventoryExists() {
        // Mock the repository response
        when(inventoryRepo.existsById("1")).thenReturn(true);

        // Call the service method
        boolean result = inventoryService.deleteById("1");

        // Verify interactions and results
        verify(inventoryRepo, times(1)).deleteById("1");
        assertTrue(result);
    }

    @Test
    void testDeleteByIdWhenInventoryDoesNotExist() {
        // Mock the repository response
        when(inventoryRepo.existsById("1")).thenReturn(false);

        // Call the service method
        boolean result = inventoryService.deleteById("1");

        // Verify that the repository delete method is not called
        verify(inventoryRepo, never()).deleteById(anyString());
        assertFalse(result);
    }
}
