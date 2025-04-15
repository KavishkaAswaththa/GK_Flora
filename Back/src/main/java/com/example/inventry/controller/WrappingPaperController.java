package com.example.inventry.controller;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.service.ImageService;
import com.example.inventry.service.WrappingPaperService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/wrappingPapers")
@CrossOrigin(origins = "http://localhost:8080")
public class WrappingPaperController {

    private final WrappingPaperService wrappingPaperService;
    private final ImageService imageService;

    public WrappingPaperController(WrappingPaperService wrappingPaperService, ImageService imageService) {
        this.wrappingPaperService = wrappingPaperService;
        this.imageService = imageService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> addWrappingPaper(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a file.");
            }

            List<String> imageIds = imageService.uploadImages(new MultipartFile[]{file});
            WrappingPaper paper = new WrappingPaper(imageIds);
            wrappingPaperService.save(paper);

            return ResponseEntity.ok("Wrapping paper saved successfully with ID: " + paper.getId());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save wrapping paper due to an error with the file upload.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing the request: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllWrappingPapers() {
        try {
            List<WrappingPaper> papers = wrappingPaperService.getAllWrappingPapers();
            List<Map<String, Object>> responseList = new ArrayList<>();

            for (WrappingPaper paper : papers) {
                String base64Image = null;
                if (paper.getImageIds() != null && !paper.getImageIds().isEmpty()) {
                    byte[] imageData = imageService.getImageById(paper.getImageIds().get(0));
                    if (imageData != null) {
                        base64Image = Base64.getEncoder().encodeToString(imageData); // Convert image to Base64
                    }
                }

                Map<String, Object> paperMap = new HashMap<>();
                paperMap.put("id", paper.getId());
                paperMap.put("image", base64Image);

                responseList.add(paperMap);
            }

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWrappingPaper(@PathVariable String id) {
        boolean deleted = wrappingPaperService.deleteWrappingPaperById(id);
        if (deleted) {
            return ResponseEntity.ok("Wrapping paper with ID " + id + " deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Wrapping paper with ID " + id + " not found.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateWrappingPaper(
            @RequestParam("id") String id,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            WrappingPaper paper = wrappingPaperService.getById(id);
            if (paper == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Wrapping paper not found.");
            }

            if (file != null && !file.isEmpty()) {
                // If file is provided, upload and update the wrapping paper
                List<String> imageIds = imageService.uploadImages(new MultipartFile[]{file});
                paper.setImageIds(imageIds);
            }

            wrappingPaperService.save(paper);
            return ResponseEntity.ok("Wrapping paper updated successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update wrapping paper.");
        }
    }
}
