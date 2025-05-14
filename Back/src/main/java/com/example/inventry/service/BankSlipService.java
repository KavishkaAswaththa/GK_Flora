package com.example.inventry.service;

import com.example.inventry.entity.BankSlip;
import com.example.inventry.repo.BankSlipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        bankSlip.setUploadDate(new java.util.Date());
        bankSlip.setStatus("PENDING");

        return bankSlipRepository.save(bankSlip);
    }

    public BankSlip getBankSlip(String id) {
        Optional<BankSlip> bankSlipOpt = bankSlipRepository.findById(id);
        return bankSlipOpt.orElse(null);
    }

    public List<BankSlip> getBankSlipsByStatus(String status) {
        if ("all".equalsIgnoreCase(status)) {
            return bankSlipRepository.findAll();
        }
        return bankSlipRepository.findByStatus(status.toUpperCase());
    }

    public BankSlip updateBankSlipStatus(String id, String status, String rejectReason) {
        BankSlip bankSlip = getBankSlip(id);
        if (bankSlip != null) {
            bankSlip.setStatus(status.toUpperCase());
            if ("REJECTED".equals(status.toUpperCase()) && rejectReason != null && !rejectReason.isEmpty()) {
                bankSlip.setRejectReason(rejectReason);
            }
            return bankSlipRepository.save(bankSlip);
        }
        return null;
    }

    public BankSlip getBankSlipByOrderId(String orderId) {

        return null;
    }

    public BankSlip updateBankSlip(BankSlip slip) {
<<<<<<< Updated upstream

        return slip;
=======
        return bankSlipRepository.save(slip);

//        return slip;
>>>>>>> Stashed changes
    }

    public List<BankSlip> getAllBankSlips() {

        return List.of();
    }
}