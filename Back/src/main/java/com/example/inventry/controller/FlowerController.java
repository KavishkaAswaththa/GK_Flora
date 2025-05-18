package com.example.inventry.controller;

import com.example.inventry.entity.Flower;
import com.example.inventry.service.FlowerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/flowers")
@CrossOrigin(origins = "http://localhost:5173")
public class FlowerController {

    private final FlowerService flowerService;

    public FlowerController(FlowerService flowerService) {
        this.flowerService = flowerService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addFlower(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("image") MultipartFile image) {
        try {
            Flower flower = flowerService.addFlower(name, price, image);
            return ResponseEntity.ok(flower);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving flower image.");
        }
    }

    @GetMapping("/all")
    public List<Flower> getAllFlowers() {
        return flowerService.getAllFlowers();
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateFlower(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Flower updatedFlower = flowerService.updateFlower(id, name, price, image);
            return ResponseEntity.ok(updatedFlower);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error updating flower image.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlower(@PathVariable String id) {
        try {
            flowerService.deleteFlower(id);
            return ResponseEntity.ok("Flower deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
