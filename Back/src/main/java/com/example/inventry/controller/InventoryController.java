package com.example.inventry.controller;

import com.example.inventry.entity.Inventory;
//import com.example.inventry.entity.InventoryResponse;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.InventoryService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080") // Allow only this origin
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ImageService imageService;

    @PostMapping("/save")
    public ResponseEntity<String> saveInventoryWithImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("bloomContains") String bloomContains) {
        try {
            if (files.length < 1 || files.length > 6) {
                return ResponseEntity.badRequest().body("Please upload between 1 and 6 images.");
            }

            List<String> imageIds = imageService.uploadImages(files);

            Inventory inventory = new Inventory();
            inventory.setName(name.trim());
            inventory.setCategory(category.trim());
            inventory.setDescription(description.trim());
            inventory.setPrice(price);
            inventory.setBloomContains(bloomContains.trim());
            inventory.setImageIds(imageIds);

            inventoryService.save(inventory);

            return ResponseEntity.ok("Inventory saved successfully with ID: " + inventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save inventory.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInventoryDetails(@PathVariable String id) {
        try {
            Inventory inventory = inventoryService.getById(id);
            if (inventory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Inventory not found."));
            }

            // Prepare images in base64 format
            List<Map<String, String>> images = new ArrayList<>();
            for (String imageId : inventory.getImageIds()) {
                byte[] imageData = imageService.getImageById(imageId);
                if (imageData != null) {
                    String base64Image = Base64.getEncoder().encodeToString(imageData);
                    images.add(Map.of("id", imageId, "base64", base64Image));
                } else {
                    images.add(Map.of("id", imageId, "base64", "Image not found"));
                }
            }

            // Prepare response map
            Map<String, Object> response = new HashMap<>();
            response.put("id", inventory.get_id());
            response.put("name", inventory.getName());
            response.put("category", inventory.getCategory());
            response.put("description", inventory.getDescription());
            response.put("price", inventory.getPrice());
            response.put("bloomContains", inventory.getBloomContains());
            response.put("images", images);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve inventory: " + e.getMessage()));
        }
    }

    @GetMapping("/search/all")
    public ResponseEntity<List<Map<String, Object>>> getAllItems() {
        try {
            List<Inventory> inventories = inventoryService.getAllInventories();
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (Inventory inventory : inventories) {
                String base64Image = null;

                if (inventory.getImageIds() != null && !inventory.getImageIds().isEmpty()) {
                    byte[] imageData = imageService.getImageById(inventory.getImageIds().get(0));
                    base64Image = Base64.getEncoder().encodeToString(imageData);
                }

                Map<String, Object> item = new HashMap<>();
                item.put("id", inventory.get_id());
                item.put("name", inventory.getName());
                item.put("category", inventory.getCategory());
                item.put("description", inventory.getDescription());
                item.put("price", inventory.getPrice());
                item.put("bloomContains", inventory.getBloomContains());
                item.put("image", base64Image);

                responseList.add(item);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateInventoryWithImages(
            @RequestParam("id") String id,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("bloomContains") String bloomContains) {
        try {
            Inventory existingInventory = inventoryService.getById(id);
            if (existingInventory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventory item with ID " + id + " not found.");
            }

            // Update inventory details
            existingInventory.setName(name);
            existingInventory.setCategory(category);
            existingInventory.setDescription(description);
            existingInventory.setPrice(price);
            existingInventory.setBloomContains(bloomContains);

            // If new images are provided, validate and update the images
            if (files != null && files.length > 0) {
                if (files.length < 1 || files.length > 6) {
                    return ResponseEntity.badRequest().body("You must upload between 1 and 6 images.");
                }

                List<String> newImageIds = imageService.uploadImages(files);
                existingInventory.setImageIds(newImageIds);
            }

            // Save the updated inventory object
            inventoryService.save(existingInventory);

            return ResponseEntity.ok("Inventory updated successfully with ID: " + existingInventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update inventory!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable String id) {
        try {
            boolean deleted = inventoryService.deleteById(id);
            if (deleted) {
                return ResponseEntity.ok("Inventory with ID " + id + " deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventory with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete inventory!");
        }
    }

    /**
     * Retrieve all inventory items (without image)
     */
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventories() {

        List<Inventory> inventories = inventoryService.getAllInventories();
        return ResponseEntity.ok(inventories);
    }

}
