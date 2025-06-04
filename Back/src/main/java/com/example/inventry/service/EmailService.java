package com.example.inventry.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.sender.email}")
    private String senderEmail;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // General-purpose email sending (HTML support)
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = multipart
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true = HTML email
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    // Send order status email to customer
    public void sendOrderStatus(String toEmail, String status) {
        String subject = "Order Status Update";
        String body = "Dear customer,<br><br>Your order status is: <b>" + status + "</b>.<br><br>Thank you!";
        sendEmail(toEmail, subject, body);
    }

    // Send confirmation email to user
    public void sendConfirmationToUser(String toEmail) {
        String subject = "Payment Confirmed";
        String body = "Dear customer,<br><br>Your payment has been <b>confirmed</b>.<br>Thank you for your order!";
        sendEmail(toEmail, subject, body);
    }

    public void sendRejectToUser(String toEmail) {
        String subject = "Payment Rejected";
        String body = "Dear customer,<br><br>Your payment has been <b>rejected</b>.<br>Please try again.";
        sendEmail(toEmail, subject, body);
    }

    // Send uploaded payment slip to admin
    public void sendSlipToAdmin(String adminEmail, MultipartFile slipFile, String userEmail) throws MessagingException, IOException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(senderEmail);
            helper.setTo(adminEmail);
            helper.setSubject("Payment Slip from " + userEmail);
            helper.setText("User " + userEmail + " uploaded a payment slip. Please find the attachment.");
            helper.setReplyTo(userEmail);
            helper.addAttachment(slipFile.getOriginalFilename(), slipFile);

            mailSender.send(message);
            logger.info("Slip sent to admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send slip to admin: {}. Error: {}", adminEmail, e.getMessage());
            throw new RuntimeException("Failed to send slip: " + e.getMessage());
        }
    }

    // Low stock alert to admins
    public void sendLowStockAlert(String itemName, int qty, List<String> adminEmails) {
        for (String email : adminEmails) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(email);
                message.setSubject("⚠️ Low Stock Alert: " + itemName);
                message.setText("The item \"" + itemName + "\" is low in stock. Current quantity: " + qty);
                mailSender.send(message);
                logger.info("Low stock alert sent to admin: {}", email);
            } catch (Exception e) {
                logger.error("Failed to send low stock alert to: {}. Error: {}", email, e.getMessage());
            }
        }
    }

    public void sendSimpleMessage(String userEmail, String emailSubject, String emailBody) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(userEmail);
            message.setSubject(emailSubject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Simple email sent to: {}", userEmail);
        } catch (Exception e) {
            logger.error("Failed to send simple message to: {}. Error: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendEmailWithAttachment(String adminEmail, String subject, String message, MultipartFile file, String userEmail) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(senderEmail);
            helper.setTo(adminEmail);
            helper.setSubject(subject);
            helper.setText(message);
            helper.setReplyTo(userEmail);
            helper.addAttachment(file.getOriginalFilename(), file);

            mailSender.send(mimeMessage);
            logger.info("Email with attachment sent to: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send email with attachment to: {}. Error: {}", adminEmail, e.getMessage());
            throw new RuntimeException("Failed to send email with attachment: " + e.getMessage());
        }
    }
}
