package com.example.inventry.controller;

import com.example.inventry.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Endpoint to send order status to user
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

    // Endpoint to send payment slip to admin
    @PostMapping("/upload-slip")
    public ResponseEntity<String> uploadSlip(
            @RequestParam("slip") MultipartFile slipFile,
            @RequestParam("userEmail") String userEmail
    ) {
        try {
            emailService.sendSlipToAdmin("gamindumpasan1997@gmail.com", slipFile, userEmail);
            return ResponseEntity.ok("Slip sent to admin");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("IO Error while sending slip: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send slip: " + e.getMessage());
        }
    }

    // Endpoint for admin to confirm payment to user
    @PostMapping("/confirm-payment")
    public ResponseEntity<String> confirmPayment(@RequestParam String userEmail) {
        try {
            emailService.sendConfirmationToUser(userEmail);
            return ResponseEntity.ok("Confirmation sent to " + userEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send confirmation: " + e.getMessage());
        }
    }
}
