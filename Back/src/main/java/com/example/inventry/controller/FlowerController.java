package com.example.inventry.controller;

import com.example.inventry.entity.Flower;
import com.example.inventry.service.FlowerService;
import com.example.inventry.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api/flowers")
public class FlowerController {

    @Autowired
    private FlowerService flowerService;

    @Autowired
    private ImageService imageService;

    @PostMapping("/save")
    public ResponseEntity<String> saveFlower(
            @RequestParam("name") String name,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload an image.");
            }

            List<String> imageIds = imageService.uploadImages(new MultipartFile[]{file});

            Flower flower = new Flower();
            flower.setName(name);
            flower.setImageIds(imageIds);

            flowerService.save(flower);

            return ResponseEntity.ok("Flower saved successfully with ID: " + flower.getId());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save flower.");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllFlowers() {
        try {
            List<Flower> flowers = flowerService.getAll();
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (Flower flower : flowers) {
                String base64Image = null;
                if (flower.getImageIds() != null && !flower.getImageIds().isEmpty()) {
                    byte[] imageData = imageService.getImageById(flower.getImageIds().get(0));
                    if (imageData != null) {
                        base64Image = Base64.getEncoder().encodeToString(imageData);
                    }
                }

                Map<String, Object> flowerMap = new HashMap<>();
                flowerMap.put("id", flower.getId());
                flowerMap.put("name", flower.getName());
                flowerMap.put("image", base64Image);

                responseList.add(flowerMap);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFlower(@PathVariable String id) {
        try {
            boolean deleted = flowerService.deleteById(id);
            if (deleted) {
                return ResponseEntity.ok("Flower with ID " + id + " deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flower with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete flower!");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateFlower(
            @RequestParam("id") String id,
            @RequestParam("name") String name,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Flower flower = flowerService.getById(id);
            if (flower == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flower not found.");
            }

            flower.setName(name);

            if (file != null && !file.isEmpty()) {
                List<String> imageIds = imageService.uploadImages(new MultipartFile[]{file});
                flower.setImageIds(imageIds);
            }

            flowerService.save(flower);

            return ResponseEntity.ok("Flower updated successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update flower.");
        }
    }
}
