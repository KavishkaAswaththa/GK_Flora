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
@CrossOrigin(origins = "http://localhost:5173")  // Ensure this is correctly set for your frontend URL
public class WrappingPaperController {

    private final WrappingPaperService wrappingPaperService;

    public WrappingPaperController(WrappingPaperService wrappingPaperService) {
        this.wrappingPaperService = wrappingPaperService;
    }

    /**
     * Endpoint to add a wrapping paper image
     *
     * @param image MultipartFile for wrapping paper image
     * @return ResponseEntity with the created wrapping paper or error message
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addWrappingPaper(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is empty.");
        }

        try {
            WrappingPaper wrappingPaper = wrappingPaperService.addWrappingPaper(image);
            return ResponseEntity.ok(wrappingPaper);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid file type. Please upload a valid image.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving wrapping paper image.");
        }
    }

    /**
     * Endpoint to retrieve all wrapping papers with Base64-encoded images
     *
     * @return List of all wrapping papers with Base64 image data
     */
    @GetMapping
    public ResponseEntity<List<WrappingPaper>> getAllWrappingPapers() {
        List<WrappingPaper> wrappingPapers = wrappingPaperService.getAllWrappingPapers();
        if (wrappingPapers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(wrappingPapers);
    }
}
