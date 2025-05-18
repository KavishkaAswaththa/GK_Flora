package com.example.inventry.controller;

import com.example.inventry.entity.BloomTags;
import com.example.inventry.repo.BloomTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bloom-tags")
@CrossOrigin
public class BloomTagController {

    @Autowired
    private BloomTagRepository bloomTagRepository;

    @GetMapping
    public List<String> getTags() {
        return bloomTagRepository.findAll()
                .stream()
                .map(BloomTags::getName)
                .toList();
    }

    @PostMapping
    public ResponseEntity<String> addTag(@RequestBody String tagName) {
        // Prevent duplicates
        if (bloomTagRepository.findByName(tagName).isEmpty()) {
            bloomTagRepository.save(new BloomTags(tagName));
            return ResponseEntity.ok("Tag added.");
        } else {
            return ResponseEntity.badRequest().body("Tag already exists.");
        }
    }

    @DeleteMapping("/{tag}")
    public ResponseEntity<String> deleteTag(@PathVariable String tag) {
        bloomTagRepository.deleteByName(tag);
        return ResponseEntity.ok("Tag deleted.");
    }
}
