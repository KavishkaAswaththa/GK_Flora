package com.example.inventry.service;

import com.example.inventry.entity.Flower;
import com.example.inventry.repo.FlowerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FlowerService {
    private final FlowerRepository flowerRepository;
    private static final String UPLOAD_DIR = "uploads/flowers/";

    public FlowerService(FlowerRepository flowerRepository) {
        this.flowerRepository = flowerRepository;
    }

    public Flower addFlower(String name, MultipartFile image) throws IOException {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Flower name cannot be empty.");
        }
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Flower image cannot be empty.");
        }

        // ✅ Generate unique filename
        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);

        // ✅ Ensure directory exists
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // ✅ Save image to file system
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ Save flower details in database
        Flower flower = new Flower();
        flower.setName(name);
        flower.setImageUrl("/uploads/flowers/" + filename); // Relative path for frontend

        return flowerRepository.save(flower);
    }

    public List<Flower> getAllFlowers() {
        return flowerRepository.findAll();
    }
}
