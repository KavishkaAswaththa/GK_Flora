package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.InventoryRepo;
import com.mongodb.client.gridfs.GridFSBucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepo inventoryRepo;

    @Autowired
    private GridFSBucket gridFSBucket;

    @Autowired
    private EmailService emailService;

    // Define admin emails for alerts
    private static final List<String> ADMIN_EMAILS = Arrays.asList(
            "gamindumpasan1997@gmail.com",
            "kavindiyapa1999@gmail.com"
    );

    // Check for low stock items every 7 days at 9 AM
    @Scheduled(cron = "0 0 9 */7 * *")
    public void checkLowStockInventory() {
        List<Inventory> inventories = inventoryRepo.findAll();

        for (Inventory inventory : inventories) {
            if (inventory.getQty() < 5) {
                emailService.sendLowStockAlert(inventory.getName(), inventory.getQty(), ADMIN_EMAILS);
            }
        }
    }

    public boolean updateQty(String id, int newQty, String email) {
        Inventory inventory = getById(id);
        if (inventory == null || !isAdmin(email)) {
            return false;
        }
        inventory.setQty(newQty);
        inventoryRepo.save(inventory);
        return true;
    }


    // Save inventory - only allowed for admins
    public boolean save(Inventory inventory, String userEmail) {
        if (isAdmin(userEmail)) {
            inventoryRepo.save(inventory);

            // Send low stock alert if qty < 5
            if (inventory.getQty() < 5) {
                emailService.sendLowStockAlert(inventory.getName(), inventory.getQty(), ADMIN_EMAILS);
            }

            return true;
        }
        return false;
    }

    // Retrieve all inventories
    public List<Inventory> getAllInventories() {
        return inventoryRepo.findAll();
    }

    // Get inventory by ID
    public Inventory getById(String id) {
        return inventoryRepo.findById(id).orElse(null);
    }

    // Delete inventory - only for admins
    public boolean deleteById(String id, String userEmail) {
        if (isAdmin(userEmail) && inventoryRepo.existsById(id)) {
            inventoryRepo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Helper method to check admin
    private boolean isAdmin(String email) {
        return ADMIN_EMAILS.contains(email);
    }
}
