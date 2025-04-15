package com.example.inventry.service;

import com.example.inventry.entity.Flower;
import com.example.inventry.repo.FlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlowerService {

    @Autowired
    private FlowerRepository flowerRepository;

    public Flower save(Flower flower) {
        return flowerRepository.save(flower);
    }

    public Flower getById(String id) {
        return flowerRepository.findById(id).orElse(null);
    }

    public List<Flower> getAll() {
        return flowerRepository.findAll();
    }

    public boolean deleteById(String id) {
        if (flowerRepository.existsById(id)) {
            flowerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
