package com.example.inventry.repo;

import com.example.inventry.entity.Banner;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BannerRepository extends MongoRepository<Banner, String> {
    List<Banner> findByAvailable(boolean available);
}

