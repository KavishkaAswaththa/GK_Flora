package com.example.inventry.repo;

import com.example.inventry.entity.BloomTags;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BloomTagRepository extends MongoRepository<BloomTags, String> {
    Optional<BloomTags> findByName(String name);
    void deleteByName(String name);
}
