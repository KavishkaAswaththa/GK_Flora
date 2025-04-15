package com.example.inventry.controller;

import com.example.inventry.entity.City;
import com.example.inventry.entity.Delivery;
import com.example.inventry.service.DeliveryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryServices deliveryServices;

    // In-memory city list with City objects instead of strings
    private List<City> cityList = new ArrayList<>();

    // -----------------------------------------------
    // Delivery endpoints
    // -----------------------------------------------
    @PostMapping(value = "/save")
    private String saveDelivery(@RequestBody Delivery delivery) {
        deliveryServices.saveorUpdate(delivery);
        return delivery.get_id();
    }

    @PostMapping(value = "/saveperson")
    private String savepersonDelivery(@RequestBody Delivery delivery) {
        deliveryServices.saveorUpdateadmin(delivery);
        return delivery.get_id();
    }

    @GetMapping(value = "/getall")
    public Iterable<Delivery> getDelivery() {
        return deliveryServices.listAll();
    }

    @GetMapping(value = "/getperson")
    public Iterable<Delivery> getDeliveryadmin() {
        return deliveryServices.listAll();
    }

    @PutMapping(value = "/edit/{id}")
    public Delivery update(@RequestBody Delivery delivery, @PathVariable(name = "id") String _id) {
        delivery.set_id(_id);
        deliveryServices.saveorUpdate(delivery);
        return delivery;
    }

    @PutMapping(value = "/update-person/{id}")
    public Delivery updateDeliveryPersonDetails(@RequestBody Delivery delivery, @PathVariable(name = "id") String id) {
        Delivery existingDelivery = deliveryServices.getDeliveryByID(id);
        if (existingDelivery != null) {
            existingDelivery.setDelivername(delivery.getDelivername());
            existingDelivery.setDeliverphone(delivery.getDeliverphone());
            deliveryServices.saveorUpdateadmin(existingDelivery);
        } else {
            throw new RuntimeException("Delivery not found for ID: " + id);
        }
        return existingDelivery;
    }

    @DeleteMapping("/deleteperson/{id}")
    private void deleteDelivery(@PathVariable("id") String _id) {
        deliveryServices.deleteDelivery(_id);
    }

    @DeleteMapping("/delete/{id}")
    private void deletepersonDelivery(@PathVariable("id") String _id) {
        deliveryServices.deleteDelivery(_id);
    }

    // -----------------------------------------------
    // City management endpoints (Admin only)
    // -----------------------------------------------

    @GetMapping("/cities")
    public List<City> getCities() {
        return cityList;
    }

    @PostMapping("/cities")
    public City addCity(@RequestBody City cityRequest) {
        // Generate unique ID for the city
        City newCity = new City(UUID.randomUUID().toString(), cityRequest.getName());
        cityList.add(newCity);
        return newCity;
    }

    @PutMapping("/cities/{id}")
    public City updateCity(@PathVariable String id, @RequestBody City cityRequest) {
        for (int i = 0; i < cityList.size(); i++) {
            if (cityList.get(i).getId().equals(id)) {
                City updatedCity = new City(id, cityRequest.getName());
                cityList.set(i, updatedCity);
                return updatedCity;
            }
        }
        throw new RuntimeException("City not found with id: " + id);
    }

    @DeleteMapping("/cities/{id}")
    public void deleteCity(@PathVariable String id) {
        cityList = cityList.stream()
                .filter(city -> !city.getId().equals(id))
                .collect(Collectors.toList());
    }
}