package com.example.inventry.controller;

import com.example.inventry.entity.BankSlip;
import com.example.inventry.repo.BankSlipRepository;
import com.example.inventry.service.EmailService;
import com.example.inventry.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class EmailController {

    private final BankSlipRepository bankSlipRepository;
    private final EmailService emailService;

    // Constructor-based dependency injection
    public EmailController(BankSlipRepository bankSlipRepository, EmailService emailService) {
        this.bankSlipRepository = bankSlipRepository;
        this.emailService = emailService;
    }

    @Autowired
//    private EmailService emailService;
    private InventoryService inventoryService;
//    private BankSlipRepository bankSlipRepository;


    // Endpoint to send order status to user
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/send-order-status")
    public ResponseEntity<String> sendOrderStatus(
            @RequestParam String userEmail,
            @RequestParam String status,
            @RequestParam(required = false) String adminEmail // adminEmail is optional
    ) {
        try {
            // You can log or store adminEmail for tracking purposes if needed
            System.out.println("Admin " + adminEmail + " is sending order status to " + userEmail);

            emailService.sendOrderStatus(userEmail, status);
            return ResponseEntity.ok("Order status sent to " + userEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send order status: " + e.getMessage());
        }
    }

    @PostMapping("/upload-slip")
    public ResponseEntity<String> uploadSlip(
            @RequestParam("slip") MultipartFile slipFile,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("orderId") String orderId
    ) {
        try {
            // Prevent admin email from submitting slips
            if (userEmail.equals("dinithi0425@gmail.com")) {
                return ResponseEntity.badRequest().body("Invalid email address");
            }

            // Send email to admin
            emailService.sendSlipToAdmin("dinithi0425@gmail.com", slipFile, userEmail);

            // Save slip to MongoDB
            BankSlip slip = new BankSlip(
                    slipFile.getOriginalFilename(),
                    slipFile.getContentType(),
                    slipFile.getBytes(),
                    orderId,
                    userEmail
            );

            bankSlipRepository.save(slip);

            return ResponseEntity.ok("Slip sent and saved successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("IO Error while sending slip: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send or save slip: " + e.getMessage());
        }
    }






    // Endpoint for admin to confirm payment to user
//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/confirm-payment")
    public ResponseEntity<String> confirmPayment(@RequestParam String userEmail) {
        try {
            emailService.sendConfirmationToUser(userEmail);
            return ResponseEntity.ok("Confirmation sent to " + userEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send confirmation: " + e.getMessage());
        }
    }

    @PostMapping("/reject-payment")
    public ResponseEntity<String> rejectPayment(@RequestParam String userEmail) {
        try {
            emailService.sendRejectToUser(userEmail);
            return ResponseEntity.ok("Confirmation sent to " + userEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send confirmation: " + e.getMessage());
        }

    }

    @PostMapping("/send-shipping-status")
    public ResponseEntity<String> sendShippingStatusEmail(
            @RequestParam("userEmail") String userEmail,
            @RequestParam("shippingStatus") String shippingStatus
    ) {
        try {
            String subject = "Shipping Status Update";
            String message = "Dear customer,\n\nYour shipping status has been updated to: "
                    + shippingStatus + ".\n\nThank you for your order.";

            emailService.sendSimpleMessage(userEmail, subject, message);

            return ResponseEntity.ok("Shipping status email sent to " + userEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send shipping status email: " + e.getMessage());
        }


}}