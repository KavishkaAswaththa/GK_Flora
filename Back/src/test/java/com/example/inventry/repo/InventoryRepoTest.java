package com.example.inventry.repo;

import com.example.inventry.entity.Inventory;
import com.example.inventry.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryRepoTest {

    @Mock
    private InventoryRepo inventoryRepo;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    public void testSaveInventory() {
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");

        when(inventoryRepo.save(inventory)).thenReturn(inventory);

        Inventory savedInventory = inventoryRepo.save(inventory);
        assertNotNull(savedInventory);
        assertEquals("Test Item", savedInventory.getName());
    }

    @Test
    public void testFindById() {
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");

        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));

        Optional<Inventory> retrievedInventory = inventoryRepo.findById("1");
        assertTrue(retrievedInventory.isPresent());
        assertEquals("Test Item", retrievedInventory.get().getName());
    }

    @Test
    public void testFindAll() {
        Inventory inventory1 = new Inventory();
        inventory1.set_id("1");
        inventory1.setName("Item 1");

        Inventory inventory2 = new Inventory();
        inventory2.set_id("2");
        inventory2.setName("Item 2");

        when(inventoryRepo.findAll()).thenReturn(List.of(inventory1, inventory2));

        List<Inventory> inventories = inventoryRepo.findAll();
        assertEquals(2, inventories.size());
        assertEquals("Item 1", inventories.get(0).getName());
        assertEquals("Item 2", inventories.get(1).getName());
    }

    @Test
    public void testDeleteById() {
        doNothing().when(inventoryRepo).deleteById("1");

        inventoryRepo.deleteById("1");

        verify(inventoryRepo, times(1)).deleteById("1");
    }
}
