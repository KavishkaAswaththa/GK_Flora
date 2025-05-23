package com.example.inventry.controller;

import com.example.inventry.entity.BankSlip;
import com.example.inventry.service.BankSlipService;
import com.example.inventry.service.EmailService;
import com.example.inventry.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.inventry.repo.BankSlipRepository;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank-slips")
@CrossOrigin(origins = "http://localhost:5173")
public class BankSlipController {

    private final BankSlipRepository bankSlipRepository;
    @Autowired
    private BankSlipService bankSlipService;
    public BankSlipController(BankSlipRepository bankSlipRepository) {
        this.bankSlipRepository = bankSlipRepository;
    }

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBankSlip(
            @RequestParam("file") MultipartFile file,
            @RequestParam("orderId") String orderId,
            @RequestParam("userEmail") String userEmail) {

        try {

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("image/png") ||
                    contentType.equals("image/jpeg") ||
                    contentType.equals("application/pdf"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only PNG, JPEG, or PDF files are allowed");
            }

            // Validate file size (2MB limit)
            if (file.getSize() > 2 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size exceeds 2MB limit");
            }

            // Save the bank slip
            BankSlip savedBankSlip = bankSlipService.saveBankSlip(file, orderId, userEmail);

            // Send notification to user
            notificationService.sendNotification(userEmail,
                    "Your bank slip has been uploaded successfully. The admin will review it soon. Your payment is pending.");

            // Send email to admin with slip as attachment
            String adminEmail = "gamindumpasan1997@gmail.com";
            String subject = "New Bank Slip Uploaded by " + userEmail;
            String message = "A new bank slip has been uploaded for Order ID: " + orderId + "\n"
                    + "Uploaded by: " + userEmail;

            emailService.sendEmailWithAttachment(
                    adminEmail,
                    subject,
                    message,
                    file,
                    userEmail // sent on behalf of user
            );

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedBankSlip.getId());
            response.put("orderId", savedBankSlip.getOrderId());
            response.put("fileName", savedBankSlip.getFileName());
            response.put("status", savedBankSlip.getStatus());
            response.put("uploadDate", savedBankSlip.getUploadDate());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getBankSlip(@PathVariable String id) {
        BankSlip bankSlip = bankSlipService.getBankSlip(id);
        if (bankSlip != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", bankSlip.getId());
            response.put("orderId", bankSlip.getOrderId());
            response.put("userEmail", bankSlip.getUserEmail());
            response.put("fileName", bankSlip.getFileName());
            response.put("fileType", bankSlip.getFileType());
            response.put("uploadDate", bankSlip.getUploadDate());
            response.put("status", bankSlip.getStatus());
            response.put("verificationDate", bankSlip.getVerificationDate());
            response.put("rejectionReason", bankSlip.getRejectionReason());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getBankSlipStatusByOrderId(@PathVariable String orderId) {
        BankSlip bankSlip = bankSlipService.getBankSlipByOrderId(orderId);

        if (bankSlip != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", bankSlip.getId());
            response.put("orderId", bankSlip.getOrderId());
            response.put("status", bankSlip.getStatus());
            response.put("uploadDate", bankSlip.getUploadDate());

            if (bankSlip.getStatus().equals("VERIFIED")) {
                response.put("message", "Your payment has been verified successfully.");
                response.put("verificationDate", bankSlip.getVerificationDate());
            } else if (bankSlip.getStatus().equals("REJECTED")) {
                response.put("rejectionReason", bankSlip.getRejectionReason());
                response.put("message", "Your payment has been rejected.");
            } else {
                response.put("message", "Your payment is being processed.");
            }

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "NOT_FOUND");
            response.put("message", "No payment slip found for this order.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getBankSlips(@RequestParam(required = false) String status) {
        List<BankSlip> slips;

        if (status == null || status.equalsIgnoreCase("ALL")) {
            slips = bankSlipRepository.findByStatusIn(List.of("PENDING", "VERIFIED", "REJECTED"));
        } else {
            slips = bankSlipRepository.findByStatus(status.toUpperCase());
        }

        return ResponseEntity.ok(slips);
    }



    @GetMapping("/file/{id}")
    public ResponseEntity<?> getBankSlipFile(@PathVariable String id) {
        BankSlip bankSlip = bankSlipService.getBankSlip(id);
        if (bankSlip != null && bankSlip.getFileData() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(bankSlip.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + bankSlip.getFileName() + "\"")
                    .body(bankSlip.getFileData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update-status")
    public ResponseEntity<?> updateBankSlipStatus(@RequestBody Map<String, String> request) {
        String slipId = request.get("slipId");
        String status = request.get("status");
        String reason = request.get("reason");

        if (slipId == null || status == null) {
            return ResponseEntity.badRequest().body("Slip ID and status are required");
        }

        try {
            BankSlip slip = bankSlipService.getBankSlip(slipId);
            if (slip == null) {
                return ResponseEntity.notFound().build();
            }

            // Update status
            slip.setStatus(status);

            // Set verification or rejection information
            if (status.equals("VERIFIED")) {
                slip.setVerificationDate(new Date());
            } else if (status.equals("REJECTED")) {
                slip.setRejectionReason(reason != null ? reason : "No reason provided");
            }

            BankSlip updatedSlip = bankSlipService.updateBankSlip(slip);

            // Send email notification based on status
            try {
                String emailSubject = "Payment " + (status.equalsIgnoreCase("VERIFIED") ? "Verified" : "Rejected");
                String emailBody;

                if (status.equalsIgnoreCase("VERIFIED")) {
                    emailBody = "Your payment for order " + updatedSlip.getOrderId() + " has been approved. Thank you for your purchase!";
                } else {
                    emailBody = "Your payment for order " + updatedSlip.getOrderId() + " has been rejected. Reason: " +
                            (reason != null ? reason : "No reason provided") +
                            "\n\nPlease try uploading a new payment slip.";
                }

                emailService.sendSimpleMessage(updatedSlip.getUserEmail(), emailSubject, emailBody);

                // Send in-app notification
                notificationService.sendNotification(updatedSlip.getUserEmail(), emailBody);

            } catch (Exception e) {
                // Log error but don't fail the request
                System.err.println("Failed to send notification: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedSlip.getId());
            response.put("orderId", updatedSlip.getOrderId());
            response.put("status", updatedSlip.getStatus());
            response.put("message", "Bank slip status updated successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update status: " + e.getMessage());
        }
    }

    @PostMapping("/update-shipping-status")
    public ResponseEntity<?> updateShippingStatus(@RequestBody Map<String, String> request) {
        String slipId = request.get("slipId");
        String shippingStatus = request.get("shippingStatus");

        if (slipId == null || shippingStatus == null) {
            return ResponseEntity.badRequest().body("Slip ID and shipping status are required");
        }

        try {
            BankSlip slip = bankSlipService.getBankSlip(slipId);
            if (slip == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bank slip not found");
            }

            slip.setShippingStatus(shippingStatus);
            BankSlip updatedSlip = bankSlipService.updateBankSlip(slip);

            String subject = "Shipping Status Update";
            String message = "Dear customer,\n\nYour shipping status has been updated to: " + shippingStatus + ".\n\nThank you for your order.";

            emailService.sendSimpleMessage(updatedSlip.getUserEmail(), subject, message);
            notificationService.sendNotification(updatedSlip.getUserEmail(), "Shipping status updated: " + shippingStatus);

            return ResponseEntity.ok(Map.of(
                    "slipId", updatedSlip.getId(),
                    "shippingStatus", updatedSlip.getShippingStatus(),
                    "message", "Shipping status updated and notification sent"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update shipping status: " + e.getMessage());
        }
    }

}