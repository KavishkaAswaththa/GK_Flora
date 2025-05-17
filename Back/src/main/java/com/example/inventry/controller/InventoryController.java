package com.example.inventry.controller;

import com.example.inventry.entity.Inventory;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.InventoryService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/save")
    public ResponseEntity<String> saveInventoryWithImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("id") String id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("qty") int qty,
            @RequestParam("bloomContains") String bloomContainsJson,
            Principal principal) {
        try {
            String email = principal.getName();

            if (files.length < 1 || files.length > 6) {
                return ResponseEntity.badRequest().body("Please upload between 1 and 6 images.");
            }

            List<String> imageIds = imageService.uploadImages(files);
            List<String> bloomTags = objectMapper.readValue(bloomContainsJson, new TypeReference<List<String>>() {});

            Inventory inventory = new Inventory();
            inventory.setName(name.trim());
            inventory.set_id(id.trim());
            inventory.setCategory(category.trim());
            inventory.setDescription(description.trim());
            inventory.setPrice(price);
            inventory.setQty(qty);
            inventory.setBloomContains(bloomTags);
            inventory.setImageIds(imageIds);

            boolean saved = inventoryService.save(inventory, email);

            if (!saved) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Not an admin.");
            }

            return ResponseEntity.ok("Inventory saved successfully with ID: " + inventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save inventory.");
        }
    }

    @PutMapping("/updateQty/{id}")
    public ResponseEntity<String> updateQty(@PathVariable String id, @RequestBody Map<String, Integer> payload, Principal principal) {
        try {
            String email = principal.getName();
            int newQty = payload.get("qty");
            boolean updated = inventoryService.updateQty(id, newQty, email);

            if (!updated) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied or item not found.");
            }

            return ResponseEntity.ok("Quantity updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update quantity.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInventoryDetails(@PathVariable String id) {
        try {
            Inventory inventory = inventoryService.getById(id);
            if (inventory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Inventory not found."));
            }

            List<Map<String, String>> images = new ArrayList<>();
            for (String imageId : inventory.getImageIds()) {
                byte[] imageData = imageService.getImageById(imageId);
                String base64Image = imageData != null
                        ? Base64.getEncoder().encodeToString(imageData)
                        : "Image not found";
                images.add(Map.of("id", imageId, "base64", base64Image));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", inventory.get_id());
            response.put("name", inventory.getName());
            response.put("category", inventory.getCategory());
            response.put("description", inventory.getDescription());
            response.put("price", inventory.getPrice());
            response.put("qty", inventory.getQty());
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
                item.put("qty", inventory.getQty());
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
            @RequestParam("qty") int qty,
            @RequestParam("bloomContains") String bloomContainsJson,
            Principal principal) {
        try {
            String email = principal.getName();
            Inventory existingInventory = inventoryService.getById(id);
            if (existingInventory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventory item with ID " + id + " not found.");
            }

            existingInventory.setName(name.trim());
            existingInventory.setCategory(category.trim());
            existingInventory.setDescription(description.trim());
            existingInventory.setPrice(price);
            existingInventory.setQty(qty);

            List<String> bloomTags = objectMapper.readValue(bloomContainsJson, new TypeReference<List<String>>() {});
            existingInventory.setBloomContains(bloomTags);

            if (files != null && files.length > 0) {
                if (files.length < 1 || files.length > 6) {
                    return ResponseEntity.badRequest().body("You must upload between 1 and 6 images.");
                }

                List<String> newImageIds = imageService.uploadImages(files);
                existingInventory.setImageIds(newImageIds);
            }

            boolean updated = inventoryService.save(existingInventory, email);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Not an admin.");
            }

            return ResponseEntity.ok("Inventory updated successfully with ID: " + existingInventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update inventory!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable String id, Principal principal) {
        try {
            String email = principal.getName();
            boolean deleted = inventoryService.deleteById(id, email);
            if (deleted) {
                return ResponseEntity.ok("Inventory with ID " + id + " deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied or item not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete inventory!");
        }
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventories() {
        List<Inventory> inventories = inventoryService.getAllInventories();
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/trigger-low-stock-email")
    public ResponseEntity<String> triggerLowStockEmail() {
        inventoryService.checkLowStockInventory();
        return ResponseEntity.ok("Low stock email check triggered successfully.");
    }
}
