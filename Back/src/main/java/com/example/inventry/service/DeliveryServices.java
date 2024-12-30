package com.example.inventry.service;

import com.example.inventry.entity.Delivery;
import com.example.inventry.repo.DeliveryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryServices {
    @Autowired
    private DeliveryRepo repo;
    public void saveorUpdate(Delivery delivery) {

        repo.save(delivery);
    }
    public void saveorUpdateadmin(Delivery delivery) {

        repo.save(delivery);
    }

    public Iterable<Delivery> listAll() {

        return this.repo.findAll();
    }
    public void deleteDelivery(String id) {

        repo.deleteById(id);
    }
    public Delivery updateDeliveryPersonDetails(String id, String delivername, String deliverphone) {
        Delivery delivery = getDeliveryByID(id);
        if (delivery != null) {
            delivery.setDelivername(delivername);
            delivery.setDeliverphone(deliverphone);
            repo.save(delivery);
        }
        return delivery;
    }

    public Delivery getDeliveryByID(String id) {

        return repo.findById(id).get();
    }


}
