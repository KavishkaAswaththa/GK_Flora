package com.example.inventry.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.mail.username}")
    private String smtpUser;

    @Value("${app.sender.email}")
    private String senderEmail;

    public String getJwtSecret() { return jwtSecret; }
    public String getMongoUri() { return mongoUri; }
    public String getSmtpUser() { return smtpUser; }
    public String getSenderEmail() { return senderEmail; }
}

