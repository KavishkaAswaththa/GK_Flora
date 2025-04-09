package com.example.inventry.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // General-purpose email sending (HTML support)
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = multipart
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

    // Send uploaded payment slip to admin
    public void sendSlipToAdmin(String adminEmail, MultipartFile slipFile, String userEmail) throws MessagingException, IOException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(adminEmail);
            helper.setSubject("Payment Slip from " + userEmail);
            helper.setText("User " + userEmail + " uploaded a payment slip.");
            helper.addAttachment(slipFile.getOriginalFilename(), slipFile);
            mailSender.send(message);
            logger.info("Slip sent to admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send slip to admin: {}. Error: {}", adminEmail, e.getMessage());
            throw new RuntimeException("Failed to send slip: " + e.getMessage());
        }
    }
}
