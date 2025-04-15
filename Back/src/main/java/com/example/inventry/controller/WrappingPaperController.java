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

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addWrappingPaper(@RequestParam("image") MultipartFile image) {
        try {
            WrappingPaper wrappingPaper = wrappingPaperService.addWrappingPaper(image);
            return ResponseEntity.ok(wrappingPaper);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving wrapping paper image.");
        }
    }

    @GetMapping
    public List<WrappingPaper> getAllWrappingPapers() {
        return wrappingPaperService.getAllWrappingPapers();
    }
}