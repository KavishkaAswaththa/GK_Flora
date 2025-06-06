package com.example.inventry.controller;

import com.example.inventry.entity.Banner;
import com.example.inventry.repo.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "http://localhost:5173")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @PostMapping("/add")
    public Banner addBanner(@RequestBody Banner banner, @RequestHeader("role") String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admins can add banners.");
        }
        return bannerRepository.save(banner);
    }

    @PutMapping("/{id}")
    public Banner updateBanner(@PathVariable String id, @RequestBody Banner updatedBanner, @RequestHeader("role") String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admins can update banners.");
        }
        updatedBanner.setId(id);
        return bannerRepository.save(updatedBanner);
    }

    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable String id, @RequestHeader("role") String role) {
        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admins can delete banners.");
        }
        bannerRepository.deleteById(id);
    }
}

