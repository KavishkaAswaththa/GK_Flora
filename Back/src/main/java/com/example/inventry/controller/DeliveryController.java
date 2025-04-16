package com.example.inventry.controller;

import com.example.inventry.entity.Delivery;
import com.example.inventry.service.DeliveryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryServices deliveryServices;

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
    public Iterable<Delivery> getDelivery(){
        return deliveryServices.listAll();
    }

    @GetMapping(value = "/getperson")
    public Iterable<Delivery> getDeliveryadmin(){
        return deliveryServices.listAll();
    }




    @PutMapping(value = "/edit/{id}")
    public Delivery update(@RequestBody Delivery delivery, @PathVariable(name ="id") String _id) {
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
    private void deleteDelivery(@PathVariable ("id") String _id){
     deliveryServices.deleteDelivery(_id);
    }


    @DeleteMapping("/delete/{id}")
    private void deletepersonDelivery(@PathVariable ("id") String _id){
        deliveryServices.deleteDelivery(_id);
    }





}
