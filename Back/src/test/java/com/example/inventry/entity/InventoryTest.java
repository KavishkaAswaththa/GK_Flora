package com.example.inventry.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InventoryTest {

    @Test
    void testGettersAndSetters() {
        // Create an instance of Inventory
        Inventory inventory = new Inventory();

        // Set values
        inventory.set_id("1");
        inventory.setName("Test Item");
        inventory.setCategory("Test Category");
        inventory.setImageId("imageId");
        inventory.setDescription("Test Description");
        inventory.setPrice(99.99);
        inventory.setQty(5);

        // Verify values using getters
        assertEquals("1", inventory.get_id());
        assertEquals("Test Item", inventory.getName());
        assertEquals("Test Category", inventory.getCategory());
        assertEquals("imageId", inventory.getImageId());
        assertEquals("Test Description", inventory.getDescription());
        assertEquals(99.99, inventory.getPrice());
        assertEquals(5, inventory.getQty());
    }

    @Test
    void testDefaultConstructor() {
        // Create an instance using default constructor
        Inventory inventory = new Inventory();

        // Verify default values (null for objects, 0 for primitives)
        assertNull(inventory.get_id());
        assertNull(inventory.getName());
        assertNull(inventory.getCategory());
        assertNull(inventory.getImageId());
        assertNull(inventory.getDescription());
        assertNull(inventory.getPrice());
        assertEquals(0, inventory.getQty());
    }

    @Test
    void testUpdateFields() {
        // Create an instance and set initial values
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Initial Item");
        inventory.setCategory("Initial Category");

        // Update values
        inventory.setName("Updated Item");
        inventory.setCategory("Updated Category");

        // Verify updated values
        assertEquals("Updated Item", inventory.getName());
        assertEquals("Updated Category", inventory.getCategory());
    }

    @Test
    void testEqualsAndHashCode() {
        // Create two Inventory objects with the same values
        Inventory inventory1 = new Inventory();
        inventory1.set_id("1");
        inventory1.setName("Test Item");

        Inventory inventory2 = new Inventory();
        inventory2.set_id("1");
        inventory2.setName("Test Item");

        // Verify equality
        assertEquals(inventory1, inventory2);
        assertEquals(inventory1.hashCode(), inventory2.hashCode());

        // Modify one field
        inventory2.setName("Different Item");

        // Verify inequality
        assertNotEquals(inventory1, inventory2);
        assertNotEquals(inventory1.hashCode(), inventory2.hashCode());
    }
}
