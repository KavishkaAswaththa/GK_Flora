package com.example.inventry.controller;

import com.example.inventry.entity.Bouquet;
import com.example.inventry.service.BouquetService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bouquet")
@CrossOrigin(origins = "http://localhost:5173")
public class BouquetController {
    private final BouquetService bouquetService;

    public BouquetController(BouquetService bouquetService) {
        this.bouquetService = bouquetService;
    }

    @GetMapping("/random")
    public Bouquet generateBouquet() {
        return bouquetService.generateRandomBouquet();
    }
}