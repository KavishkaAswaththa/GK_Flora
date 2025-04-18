package com.example.inventry.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    // You could inject a repository for storing notifications
    // @Autowired
    // private NotificationRepository notificationRepository;

    public void sendNotification(String userEmail, String message) {
        try {
            // For demonstration, we'll just log the notification
            // In a real application, you would:
            // 1. Store notification in the database
            // 2. Potentially use WebSockets to push to the client
            System.out.println("Notification sent to " + userEmail + ": " + message);

            // Example implementation with repository:
            // Notification notification = new Notification();
            // notification.setUserEmail(userEmail);
            // notification.setMessage(message);
            // notification.setTimestamp(new Date());
            // notification.setRead(false);
            // notificationRepository.save(notification);

        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}