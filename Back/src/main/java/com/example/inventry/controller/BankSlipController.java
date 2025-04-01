package com.example.inventry.controller;
// File: BankSlipController.java


import com.example.inventry.entity.BankSlip;
import com.example.inventry.service.BankSlipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/bank-slips")
@CrossOrigin(origins = "http://localhost:5173")// Adjust this to your frontend URL in production
public class BankSlipController {

    @Autowired
    private BankSlipService bankSlipService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBankSlip(
            @RequestParam("file") MultipartFile file,
            @RequestParam("orderId") String orderId) {

        try {
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("image/png") ||
                    contentType.equals("image/jpeg") ||
                    contentType.equals("application/pdf"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only PNG, JPEG, or PDF files are allowed");
            }

            // Validate file size (2MB max)
            if (file.getSize() > 2 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size exceeds 2MB limit");
            }

            BankSlip savedBankSlip = bankSlipService.saveBankSlip(file, orderId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBankSlip);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBankSlip(@PathVariable String id) {
        BankSlip bankSlip = bankSlipService.getBankSlip(id);
        if (bankSlip != null) {
            return ResponseEntity.ok(bankSlip);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}