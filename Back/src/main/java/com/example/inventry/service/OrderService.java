package com.example.inventry.service;

import com.example.inventry.entity.Order;
import com.example.inventry.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepo repo;

    public void saveorUpdate(Order students) {

        repo.save(students);
    }

    public Iterable<Order> listAll() {

        return this.repo.findAll();
    }


    public void deleteStudent(String id) {

        repo.deleteById(id);
    }

    public Order getStudentByID(String studentid) {

        return repo.findById(studentid).get();
    }
}