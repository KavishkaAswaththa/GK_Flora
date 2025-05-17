package com.example.inventry.repo;

import com.example.inventry.entity.Inventory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class InventoryRepoTest {

    @Autowired
    private InventoryRepo inventoryRepo;

    private Inventory inventory;

    @BeforeEach
    void setUp() {
        inventoryRepo.deleteAll(); // Clear test DB before each test

        inventory = new Inventory(
                null,
                "Tulip",
                "Flower",
                "Fresh tulip bouquet",
                20.0,
                3,
                List.of("yellow", "spring"),
                List.of("img1", "img2")
        );

        inventoryRepo.save(inventory);
    }

    @Test
    void testSaveInventory() {
        Inventory saved = inventoryRepo.save(new Inventory(
                null,
                "Lily",
                "Flower",
                "White lily",
                15.0,
                8,
                List.of("white"),
                List.of("img3")
        ));

        assertNotNull(saved.get_id());
        assertEquals("Lily", saved.getName());
    }

    @Test
    void testFindById() {
        Optional<Inventory> found = inventoryRepo.findById(inventory.get_id());
        assertTrue(found.isPresent());
        assertEquals("Tulip", found.get().getName());
    }

    @Test
    void testFindAll() {
        List<Inventory> list = inventoryRepo.findAll();
        assertEquals(1, list.size());
        assertEquals("Tulip", list.get(0).getName());
    }

    @Test
    void testExistsById() {
        boolean exists = inventoryRepo.existsById(inventory.get_id());
        assertTrue(exists);
    }

    @Test
    void testDeleteById() {
        inventoryRepo.deleteById(inventory.get_id());
        Optional<Inventory> found = inventoryRepo.findById(inventory.get_id());
        assertFalse(found.isPresent());
    }

    @Test
    void testDeleteAll() {
        inventoryRepo.deleteAll();
        List<Inventory> list = inventoryRepo.findAll();
        assertTrue(list.isEmpty());
    }
}
