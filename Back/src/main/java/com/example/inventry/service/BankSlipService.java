package com.example.inventry.service;

import com.example.inventry.entity.BankSlip;
import com.example.inventry.repo.BankSlipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BankSlipService {

    @Autowired
    private BankSlipRepository bankSlipRepository;

    public BankSlip saveBankSlip(MultipartFile file, String orderId, String userEmail) throws IOException {
        // Create a new bank slip entity
        BankSlip bankSlip = new BankSlip();
        bankSlip.setFileName(file.getOriginalFilename());
        bankSlip.setFileType(file.getContentType());
        bankSlip.setFileData(file.getBytes());
        bankSlip.setOrderId(orderId);
        bankSlip.setUserEmail(userEmail);
        bankSlip.setUploadDate(new Date());
        bankSlip.setStatus("PENDING");

        return bankSlipRepository.save(bankSlip);
    }

    public BankSlip getBankSlip(String id) {
        Optional<BankSlip> bankSlipOpt = bankSlipRepository.findById(id);
        return bankSlipOpt.orElse(null);
    }

    public List<BankSlip> getBankSlipsByStatus(String status) {
        return bankSlipRepository.findByStatus(status.toUpperCase());
    }

    public BankSlip updateBankSlipStatus(String id, String status, String rejectReason) {
        BankSlip bankSlip = getBankSlip(id);
        if (bankSlip != null) {
            bankSlip.setStatus(status.toUpperCase());
            if ("REJECTED".equals(status.toUpperCase()) && rejectReason != null && !rejectReason.isEmpty()) {
                bankSlip.setRejectionReason(rejectReason);
            }
            if ("VERIFIED".equals(status.toUpperCase())) {
                bankSlip.setVerificationDate(new Date());
            }
            return bankSlipRepository.save(bankSlip);
        }
        return null;
    }

    public BankSlip getBankSlipByOrderId(String orderId) {
        // This method was empty - implement it
        return (BankSlip) bankSlipRepository.findByOrderId(orderId);
    }

    public BankSlip updateBankSlip(BankSlip slip) {



        return slip;

        return bankSlipRepository.save(slip);

//        return slip;

        // This method was returning the input parameter without saving
        
      main
    }

    public List<BankSlip> getAllBankSlips() {
        // This method was returning an empty list
        return bankSlipRepository.findAll();
    }
}