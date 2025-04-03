package com.example.inventry.service;

import com.example.inventry.entity.Bouquet;
import com.example.inventry.entity.Flower;
import com.example.inventry.repo.FlowerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BouquetService {
    private final FlowerRepository flowerRepository;

    public BouquetService(FlowerRepository flowerRepository) {
        this.flowerRepository = flowerRepository;
    }

    public Bouquet generateRandomBouquet() {
        List<Flower> allFlowers = flowerRepository.findAll();
        if (allFlowers.size() < 25) {
            throw new RuntimeException("Not enough flowers to generate a 5x5 bouquet.");
        }

        Collections.shuffle(allFlowers);
        List<List<Flower>> bouquetGrid = new ArrayList<>();

        for (int i = 0; i < 5; i++) {
            bouquetGrid.add(new ArrayList<>(allFlowers.subList(i * 5, (i + 1) * 5)));
        }

        return new Bouquet(bouquetGrid);
    }
}
