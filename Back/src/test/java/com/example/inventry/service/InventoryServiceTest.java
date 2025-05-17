package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.InventoryRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InventoryServiceTest {

    @Mock
    private InventoryRepo inventoryRepo;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private InventoryService inventoryService;

    private final String adminEmail = "gamindumpasan1997@gmail.com";
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        inventory = new Inventory(
                "1",
                "Rose",
                "Flower",
                "Red rose",
                10.0,
                4,
                List.of("red", "thorny"),
                List.of("image1", "image2")
        );
    }

    @Test
    void testSaveByAdminSendsLowStockAlert() {
        when(inventoryRepo.save(any())).thenReturn(inventory);

        boolean result = inventoryService.save(inventory, adminEmail);

        assertTrue(result);
        verify(inventoryRepo).save(inventory);
        verify(emailService).sendLowStockAlert(inventory.getName(), inventory.getQty(), List.of("gamindumpasan1997@gmail.com", "kavindiyapa1999@gmail.com"));
    }

    @Test
    void testSaveByNonAdminFails() {
        boolean result = inventoryService.save(inventory, "user@example.com");
        assertFalse(result);
        verify(inventoryRepo, never()).save(any());
        verify(emailService, never()).sendLowStockAlert(anyString(), anyInt(), anyList());
    }

    @Test
    void testUpdateQtyByAdmin() {
        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));
        when(inventoryRepo.save(any())).thenReturn(inventory);

        boolean updated = inventoryService.updateQty("1", 10, adminEmail);
        assertTrue(updated);
        assertEquals(10, inventory.getQty());
        verify(inventoryRepo).save(inventory);
    }

    @Test
    void testUpdateQtyByNonAdminFails() {
        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));

        boolean updated = inventoryService.updateQty("1", 10, "user@example.com");
        assertFalse(updated);
        verify(inventoryRepo, never()).save(any());
    }

    @Test
    void testGetByIdFound() {
        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));
        Inventory found = inventoryService.getById("1");
        assertNotNull(found);
        assertEquals("Rose", found.getName());
    }

    @Test
    void testGetByIdNotFound() {
        when(inventoryRepo.findById("1")).thenReturn(Optional.empty());
        Inventory found = inventoryService.getById("1");
        assertNull(found);
    }

    @Test
    void testDeleteByIdByAdmin() {
        when(inventoryRepo.existsById("1")).thenReturn(true);
        doNothing().when(inventoryRepo).deleteById("1");

        boolean deleted = inventoryService.deleteById("1", adminEmail);
        assertTrue(deleted);
        verify(inventoryRepo).deleteById("1");
    }

    @Test
    void testDeleteByIdByNonAdminFails() {
        boolean deleted = inventoryService.deleteById("1", "user@example.com");
        assertFalse(deleted);
        verify(inventoryRepo, never()).deleteById(anyString());
    }
}
