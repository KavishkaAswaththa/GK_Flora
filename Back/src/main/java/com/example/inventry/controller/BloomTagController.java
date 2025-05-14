package com.example.inventry.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/bloom-tags")
@CrossOrigin
public class BloomTagController {

    private final Set<String> bloomTags = new HashSet<>(List.of("Occasion", "Birthday", "Graduation", "Romance"));

    @GetMapping
    public List<String> getTags() {
        return new ArrayList<>(bloomTags);
    }

    @PostMapping
    public ResponseEntity<String> addTag(@RequestBody String tag) {
        bloomTags.add(tag);
        return ResponseEntity.ok("Tag added.");
    }

    @DeleteMapping("/{tag}")
    public ResponseEntity<String> deleteTag(@PathVariable String tag) {
        bloomTags.remove(tag);
        return ResponseEntity.ok("Tag deleted.");
    }
}
