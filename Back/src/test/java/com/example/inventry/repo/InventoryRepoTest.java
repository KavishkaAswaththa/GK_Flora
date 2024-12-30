package com.example.inventry.repo;

import com.example.inventry.entity.Inventory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest // Enables MongoDB repository tests
@TestPropertySource(properties = "spring.mongodb.embedded.version=4.4.6") // Use embedded MongoDB
class InventoryRepoTest {

    @Autowired
    private InventoryRepo inventoryRepo;

    private Inventory testInventory;

    @BeforeEach
    void setUp() {
        // Prepare a test inventory item
        testInventory = new Inventory();
        testInventory.set_id("1");
        testInventory.setName("Test Item");
        testInventory.setCategory("Test Category");
        testInventory.setDescription("Test Description");
        testInventory.setPrice(99.99);
        testInventory.setQty(10);
        testInventory.setImageId("testImageId");

        // Save the test item to the repository
        inventoryRepo.save(testInventory);
    }

    @AfterEach
    void tearDown() {
        // Clear the repository after each test
        inventoryRepo.deleteAll();
    }

    @Test
    void testSaveInventory() {
        // Verify the saved inventory item
        Optional<Inventory> savedInventory = inventoryRepo.findById("1");
        assertTrue(savedInventory.isPresent());

        Inventory inventory = savedInventory.get();
        assertEquals("Test Item", inventory.getName());
        assertEquals("Test Category", inventory.getCategory());
        assertEquals("Test Description", inventory.getDescription());
        assertEquals(99.99, inventory.getPrice());
        assertEquals(10, inventory.getQty());
        assertEquals("testImageId", inventory.getImageId());
    }

    @Test
    void testFindById() {
        // Test finding an existing inventory item by ID
        Optional<Inventory> inventory = inventoryRepo.findById("1");
        assertTrue(inventory.isPresent());
        assertEquals("Test Item", inventory.get().getName());
    }

    @Test
    void testFindAll() {
        // Test retrieving all inventory items
        Iterable<Inventory> inventories = inventoryRepo.findAll();
        assertNotNull(inventories);

        int count = 0;
        for (Inventory inventory : inventories) {
            count++;
        }
        assertEquals(1, count);
    }

    @Test
    void testDeleteById() {
        // Test deleting an inventory item by ID
        inventoryRepo.deleteById("1");

        Optional<Inventory> deletedInventory = inventoryRepo.findById("1");
        assertFalse(deletedInventory.isPresent());
    }

    @Test
    void testUpdateInventory() {
        // Update an existing inventory item
        Optional<Inventory> inventoryOptional = inventoryRepo.findById("1");
        assertTrue(inventoryOptional.isPresent());

        Inventory inventory = inventoryOptional.get();
        inventory.setPrice(199.99);
        inventory.setQty(5);
        inventoryRepo.save(inventory);

        // Verify the updated inventory item
        Inventory updatedInventory = inventoryRepo.findById("1").get();
        assertEquals(199.99, updatedInventory.getPrice());
        assertEquals(5, updatedInventory.getQty());
    }
}
