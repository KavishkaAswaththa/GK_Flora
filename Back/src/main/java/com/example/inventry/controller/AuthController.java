package com.example.inventry.controller;

import com.example.inventry.entity.*;
import com.example.inventry.service.AuthService;
import com.example.inventry.service.LoyaltyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth") // Base URL path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:5173") // Allow CORS requests from frontend
@RequiredArgsConstructor // Lombok annotation to generate constructor for final fields
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class); // Logger for debugging
    private final AuthService authService; // Injecting AuthService

    // Endpoint for user registration

    @Autowired
    private LoyaltyService loyaltyService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Step 1: Register the user
            AuthResponse response = authService.register(request);

            // Step 2: Create loyalty account with 0 points
            LoyaltyCustomer newCustomer = new LoyaltyCustomer();
            newCustomer.setName(request.getName()); // assuming RegisterRequest has a name field
            newCustomer.setEmail(request.getEmail());
            newCustomer.setPoints(0);
            newCustomer.setLevel("Silver"); // or your default level
            newCustomer.setLastPurchase(null);
            newCustomer.setPurchaseDate(null);

            loyaltyService.createCustomer(newCustomer);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }


    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request); // Call login logic
            return ResponseEntity.ok(response); // Return successful login response with token
        } catch (Exception e) {
            logger.error("Login failed: {}", e.getMessage()); // Log error
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); // Return error response
        }
    }

    // Endpoint for user logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            authService.logout(request, response); // Perform logout logic
            return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully")); // Success response
        } catch (Exception e) {
            logger.error("Logout failed: {}", e.getMessage()); // Log error
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); // Return error response
        }
    }

    // Endpoint to validate a JWT token
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            boolean isValid = authService.isAuthenticated(extractToken(token)); // Validate token
            return ResponseEntity.ok(new ApiResponse(true, "Token is valid", isValid)); // Return success
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage()); // Log error
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); // Return error
        }
    }

    // Endpoint to send OTP for password reset
    @PostMapping("/send-reset-otp")
    public ResponseEntity<?> sendResetOtp(@RequestBody ResetOtpRequest request) {
        try {
            String result = authService.sendResetOtp(request.getEmail()); // Send OTP to email
            return ResponseEntity.ok(new ApiResponse(true, result)); // Return success
        } catch (Exception e) {
            logger.error("Failed to send reset OTP: {}", e.getMessage()); // Log error
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); // Return error
        }
    }

    // Endpoint to reset password using OTP
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String result = authService.resetPassword(request.getOtp(), request.getNewPassword()); // Reset password
            return ResponseEntity.ok(new ApiResponse(true, result)); // Return success
        } catch (Exception e) {
            logger.error("Password reset failed: {}", e.getMessage()); // Log error
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage())); // Return error
        }
    }

    // Helper method to extract JWT token from "Authorization" header
    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header"); // Throw if invalid
        }
        return authHeader.substring(7); // Remove "Bearer " prefix
    }
}
