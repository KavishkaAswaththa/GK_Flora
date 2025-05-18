package com.example.inventry.service;

import com.example.inventry.entity.Flower;
import com.example.inventry.repo.FlowerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FlowerService {

    private final FlowerRepository flowerRepository;
    private static final String UPLOAD_DIR = "uploads/flowers/";

    public FlowerService(FlowerRepository flowerRepository) {
        this.flowerRepository = flowerRepository;
    }

    public Flower addFlower(String name, Double price, MultipartFile image) throws IOException {
        validateInput(name, price, image);

        String filename = saveImage(image);
        String imageBase64 = encodeImageToBase64(filename);

        Flower flower = new Flower();
        flower.setName(name);
        flower.setPrice(price);
        flower.setImagePath("/uploads/flowers/" + filename);
        flower.setImageBase64(imageBase64);

        return flowerRepository.save(flower);
    }

    public List<Flower> getAllFlowers() {
        return flowerRepository.findAll();
    }

    public Flower updateFlower(String id, String name, Double price, MultipartFile image) throws IOException {
        Optional<Flower> optionalFlower = flowerRepository.findById(id);
        if (optionalFlower.isEmpty()) {
            throw new IllegalArgumentException("Flower not found with ID: " + id);
        }

        Flower flower = optionalFlower.get();

        if (name != null && !name.trim().isEmpty()) {
            flower.setName(name);
        }
        if (price != null && price > 0) {
            flower.setPrice(price);
        }
        if (image != null && !image.isEmpty()) {
            String filename = saveImage(image);
            String imageBase64 = encodeImageToBase64(filename);
            flower.setImagePath("/uploads/flowers/" + filename);
            flower.setImageBase64(imageBase64);
        }

        return flowerRepository.save(flower);
    }

    public void deleteFlower(String id) {
        if (!flowerRepository.existsById(id)) {
            throw new IllegalArgumentException("Flower not found with ID: " + id);
        }
        flowerRepository.deleteById(id);
    }

    private void validateInput(String name, Double price, MultipartFile image) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Flower name cannot be empty.");
        }
        if (price == null || price <= 0) {
            throw new IllegalArgumentException("Flower price must be a positive number.");
        }
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Flower image cannot be empty.");
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    private String encodeImageToBase64(String filename) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
        byte[] imageBytes = Files.readAllBytes(filePath);
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
