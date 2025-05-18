package com.example.inventry.controller;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.service.WrappingPaperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/wrappingPapers")
@CrossOrigin(origins = "http://localhost:5173")
public class WrappingPaperController {

    private final WrappingPaperService wrappingPaperService;

    public WrappingPaperController(WrappingPaperService wrappingPaperService) {
        this.wrappingPaperService = wrappingPaperService;
    }

    // CREATE
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addWrappingPaper(
            @RequestParam("image") MultipartFile image,
            @RequestParam("price") Double price) {

        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is empty.");
        }

        try {
            WrappingPaper wrappingPaper = wrappingPaperService.addWrappingPaper(image, price);
            return ResponseEntity.ok(wrappingPaper);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving wrapping paper image.");
        }
    }

    // READ
    @GetMapping
    public ResponseEntity<List<WrappingPaper>> getAllWrappingPapers() {
        List<WrappingPaper> wrappingPapers = wrappingPaperService.getAllWrappingPapers();
        if (wrappingPapers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(wrappingPapers);
    }

    // UPDATE
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateWrappingPaper(
            @PathVariable String id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("price") Double price) {

        try {
            WrappingPaper updatedPaper = wrappingPaperService.updateWrappingPaper(id, image, price);
            return ResponseEntity.ok(updatedPaper);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error updating wrapping paper image.");
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWrappingPaper(@PathVariable String id) {
        try {
            wrappingPaperService.deleteWrappingPaper(id);
            return ResponseEntity.ok("Wrapping paper deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
