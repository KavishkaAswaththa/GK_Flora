package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.InventoryRepo;
import com.mongodb.client.gridfs.GridFSBucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepo inventoryRepo;

    @Autowired
    private GridFSBucket gridFSBucket;

    // Save an inventory item
    public void save(Inventory inventory) {
        inventoryRepo.save(inventory);
    }

    // Retrieve all inventory items
    public List<Inventory> getAllInventories() {
        return inventoryRepo.findAll();
    }

    // Retrieve a single inventory item by ID
    public Inventory getById(String id) {
        return inventoryRepo.findById(id).orElse(null);
    }




    public boolean deleteById(String id) {
        if (inventoryRepo.existsById(id)) {
            inventoryRepo.deleteById(id);
            return true;
        } else {
            return false; // Item not found
        }
    }

}
