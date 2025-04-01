package com.example.inventry.repo;

// File: BankSlipRepository.java


import com.example.inventry.entity.BankSlip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankSlipRepository extends MongoRepository<BankSlip, String> {
    List<BankSlip> findByOrderId(String orderId);
    List<BankSlip> findByStatus(String status);
}