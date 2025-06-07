package com.example.inventry.controller;

import com.example.inventry.entity.City;
import com.example.inventry.service.CityService;
import com.example.inventry.entity.Delivery;
import com.example.inventry.service.DeliveryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryServices deliveryServices;
    @Autowired  // Add this annotation
    private CityService cityService;

    // In-memory city list with City objects instead of strings
    private List<City> cityList = new ArrayList<>();

    // -----------------------------------------------
    // Delivery endpoints
    // -----------------------------------------------
    // CUSTOMER: Save delivery request
    @PreAuthorize("hasRole('USER')")
    @PostMapping(value = "/save")
    private String saveDelivery(@RequestBody Delivery delivery) {
        deliveryServices.saveorUpdate(delivery);
        return delivery.get_id();
    }
    // ADMIN: Fill delivery person details
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/saveperson")
    private String savepersonDelivery(@RequestBody Delivery delivery) {
        deliveryServices.saveorUpdateadmin(delivery);
        return delivery.get_id();
    }
    // ADMIN: View all deliveries
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping(value = "/getall")
    public Iterable<Delivery> getDelivery() {
        return deliveryServices.listAll();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping(value = "/getperson")
    public Iterable<Delivery> getDeliveryadmin() {
        return deliveryServices.listAll();
    }

    // CUSTOMER: Update their own delivery details
    @PreAuthorize("hasRole('USER')")
    @PutMapping(value = "/edit/{id}")
    public Delivery update(@RequestBody Delivery delivery, @PathVariable(name = "id") String _id) {
        delivery.set_id(_id);
        deliveryServices.saveorUpdate(delivery);
        return delivery;
    }

    // ADMIN: Update delivery person details
    @PreAuthorize("hasRole('ADMIN')")
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

    // Add this to DeliveryController.java

    @GetMapping(value = "/delivery-persons")
    public List<Delivery> getAllDeliveryPersons() {
        return StreamSupport.stream(deliveryServices.listAll().spliterator(), false)
                .filter(delivery -> delivery.getDelivername() != null && !delivery.getDelivername().isEmpty())
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteperson/{id}")
    private void deleteDelivery(@PathVariable("id") String _id) {
        deliveryServices.deleteDelivery(_id);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/delete/{id}")
    private void deletepersonDelivery(@PathVariable("id") String _id) {
        deliveryServices.deleteDelivery(_id);
    }

    // -----------------------------------------------
    // City management endpoints (Admin only)
    // -----------------------------------------------

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/cities")
    public List<City> getCities() {
        return cityService.getAllCities();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/cities")
    public City addCity(@RequestBody City cityRequest) {
        return cityService.addCity(cityRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cities/{id}")
    public City updateCity(@PathVariable String id, @RequestBody City cityRequest) {
        return cityService.updateCity(id, cityRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/cities/{id}")
    public void deleteCity(@PathVariable String id) {
        cityService.deleteCity(id);
    }
}