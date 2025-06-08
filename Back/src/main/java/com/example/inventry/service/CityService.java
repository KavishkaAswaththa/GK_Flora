package com.example.inventry.service;


import com.example.inventry.entity.City;
import com.example.inventry.repo.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CityService {
    @Autowired
    private CityRepository cityRepository;

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public City addCity(City city) {
        return cityRepository.save(city);
    }

    public City updateCity(String id, City city) {
        city.setId(id);
        return cityRepository.save(city);
    }

    public void deleteCity(String id) {
        cityRepository.deleteById(id);
    }
}