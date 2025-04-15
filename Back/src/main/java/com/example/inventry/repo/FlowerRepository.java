package com.example.inventry.repo;

import com.example.inventry.entity.Flower;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FlowerRepository extends MongoRepository<Flower, String> {}