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
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ImageService imageService;


    /**
     * Save a new inventory item with an associated image
     */

    @PostMapping("/save")
    public ResponseEntity<String> saveInventoryWithImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("id") String id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("qty") int qty) {
        try {
            // Step 1: Upload the image and get its ObjectId
            ObjectId fileId = imageService.uploadImage(file);

            // Step 2: Create an Inventory object
            Inventory inventory = new Inventory();
            inventory.set_id(id);
            inventory.setName(name);
            inventory.setCategory(category);
            inventory.setDescription(description);
            inventory.setPrice(price);
            inventory.setQty(qty);
            inventory.setImageId(fileId.toString());

            // Step 3: Save the Inventory object to the database
            inventoryService.save(inventory);

            return ResponseEntity.ok("Inventory saved successfully with ID: " + inventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save inventory!");
        }
    }





    @GetMapping("search/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        try {
            byte[] imageData = imageService.getImageById(imageService.getStudentByID(id));

            Inventory inventory = inventoryService.getById(id);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "image/jpeg");
            headers.add("X-ID", inventory.get_id());
            headers.add("X-Name", inventory.getName());
            headers.add("X-Category", inventory.getCategory());
            headers.add("X-Description", inventory.getDescription());
            headers.add("X-Price", String.valueOf(inventory.getPrice()));
            headers.add("X-Qty", String.valueOf(inventory.getQty()));
// Adjust as per your needs



            return ResponseEntity.ok()
                    .headers(headers)
                    .body(imageData);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("search/all")
    public ResponseEntity<List<Map<String, Object>>> getAllItems() {
        try {
            List<Inventory> inventories = inventoryService.getAllInventories(); // Fetch all inventory items
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (Inventory inventory : inventories) {
                String id = inventory.get_id();
                byte[] imageData = imageService.getImageById(imageService.getStudentByID(id));
                String base64Image = Base64.getEncoder().encodeToString(imageData);

                Map<String, Object> item = new HashMap<>();
                item.put("id", inventory.get_id());
                item.put("name", inventory.getName());
                item.put("category", inventory.getCategory());
                item.put("description", inventory.getDescription());
                item.put("price", inventory.getPrice());
                item.put("qty", inventory.getQty());
                item.put("image", base64Image); // Add base64 image string

                responseList.add(item);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }





/*
    @GetMapping("/all")
    public ResponseEntity<List<InventoryResponse>> getAllItemsWithImages() {
        try {
            // Step 1: Fetch all items
            List<Inventory> inventories = inventoryService.getAllInventories();

            // Step 2: Build a list of InventoryResponse (custom DTO with image data)
            List<InventoryResponse> responseList = inventories.stream()
                    .map(item -> {
                        try {
                            // Step 3: Fetch image data for each item
                            byte[] imageData = imageService.getImageById(item.getImageId());

                            // Step 4: Build response object
                            InventoryResponse response = new InventoryResponse();
                            response.setId(item.get_id());
                            response.setName(item.getName());
                            response.setCategory(item.getCategory());
                            response.setDescription(item.getDescription());
                            response.setPrice(item.getPrice());
                            response.setQty(item.getQty());
                            response.setImageData(imageData);

                            return response;
                        } catch (Exception e) {
                            // Handle image fetch failure gracefully
                            return null;
                        }
                    })
                    .filter(response -> response != null) // Filter out null responses
                    .toList();

            // Return the list of responses
            return ResponseEntity.ok(responseList);

        } catch (Exception e) {
            // Handle errors (e.g., database access failure)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


*/



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable String id) {
        try {
            // Call the service to delete the inventory item
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



    @PutMapping("/update")
    public ResponseEntity<String> updateInventoryWithImage(
            @RequestParam("id") String id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("qty") int qty) {
        try {
            // Step 1: Find the existing inventory item
            Inventory existingInventory = inventoryService.getById(id);
            if (existingInventory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventory item with ID " + id + " not found.");
            }

            // Step 2: Update fields
            existingInventory.setName(name);
            existingInventory.setCategory(category);
            existingInventory.setDescription(description);
            existingInventory.setPrice(price);
            existingInventory.setQty(qty);

            // Step 3: Optionally update the image if a new file is provided
            if (file != null && !file.isEmpty()) {
                // Upload new image and update the imageId
                ObjectId fileId = imageService.uploadImage(file);
                existingInventory.setImageId(fileId.toString());
            }

            // Step 4: Save the updated inventory item
            inventoryService.save(existingInventory);

            return ResponseEntity.ok("Inventory updated successfully with ID: " + existingInventory.get_id());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update inventory!");
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






    /**
     * Retrieve a single inventory item by ID with image URL
     */
/*    @GetMapping("/{id}")
    public String getById(@PathVariable String id) {
        Inventory inventory = inventoryService.getById(id);

        if (inventory == null) {
            //return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Fetch image URL from the image service

        return imageService.getImageUrlById(inventory.getImageId());
    }
*/







}
