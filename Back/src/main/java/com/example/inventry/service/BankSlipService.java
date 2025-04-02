package com.example.inventry.service;

// File: BankSlipService.java


import com.example.inventry.entity.BankSlip;
import com.example.inventry.repo.BankSlipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class BankSlipService {

    @Autowired
    private BankSlipRepository bankSlipRepository;

    public BankSlip saveBankSlip(MultipartFile file, String orderId) throws IOException {
        BankSlip bankSlip = new BankSlip(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes(),
                orderId
        );

        return bankSlipRepository.save(bankSlip);
    }

    public BankSlip getBankSlip(String id) {
        return bankSlipRepository.findById(id).orElse(null);
    }

    public List<BankSlip> getBankSlipsByOrderId(String orderId) {
        return bankSlipRepository.findByOrderId(orderId);
    }

    public List<BankSlip> getPendingBankSlips() {
        return bankSlipRepository.findByStatus("PENDING");
    }

    public BankSlip updateBankSlipStatus(String id, String status) {
        BankSlip bankSlip = bankSlipRepository.findById(id).orElse(null);
        if (bankSlip != null) {
            bankSlip.setStatus(status);
            return bankSlipRepository.save(bankSlip);
        }
        return null;
    }
}