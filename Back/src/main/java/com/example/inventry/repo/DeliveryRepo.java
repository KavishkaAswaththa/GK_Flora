package com.example.inventry.repo;
import com.example.inventry.entity.Delivery;

import org.springframework.data.repository.CrudRepository;

public interface DeliveryRepo extends CrudRepository<Delivery,String> {
}
