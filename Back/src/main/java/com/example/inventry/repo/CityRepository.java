package com.example.inventry.repo;


import com.example.inventry.entity.City;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CityRepository extends MongoRepository<City, String> {
}