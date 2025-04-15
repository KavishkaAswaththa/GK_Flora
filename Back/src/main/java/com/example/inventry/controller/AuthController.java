package com.example.inventry.controller;

import com.example.inventry.entity.*;
import com.example.inventry.repo.UserRepository;
import com.example.inventry.service.AuthService;
import com.example.inventry.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    // ================= AUTH ENDPOINTS =================

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            authService.logout(request, response);
            return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
        } catch (Exception e) {
            logger.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            boolean isValid = authService.isAuthenticated(extractToken(token));
            return ResponseEntity.ok(new ApiResponse(true, "Token is valid", isValid));
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/auth/send-reset-otp")
    public ResponseEntity<?> sendResetOtp(@RequestBody ResetOtpRequest request) {
        try {
            String result = authService.sendResetOtp(request.getEmail());
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (Exception e) {
            logger.error("Failed to send reset OTP: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String result = authService.resetPassword(request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (Exception e) {
            logger.error("Password reset failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ================= USER ENDPOINTS =================

    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "isAccountVerified", user.getIsAccountVerified(),
                    "mobileNo", user.getMobileNo(),
                    "birthday", user.getBirthday(),
                    "avatarType", user.getAvatarType(),
                    "address", user.getAddress()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid token or user not found"
            ));
        }
    }

    @PutMapping("/users/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String token,
                                               @RequestBody User updatedUser) {
        try {
            String email = jwtService.extractUsername(token.substring(7));
            User existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            existingUser.setName(updatedUser.getName());
            existingUser.setMobileNo(updatedUser.getMobileNo());
            existingUser.setBirthday(updatedUser.getBirthday());
            existingUser.setAvatarType(updatedUser.getAvatarType());
            existingUser.setAddress(updatedUser.getAddress());

            userRepository.save(existingUser);

            return ResponseEntity.ok(new ApiResponse(true, "User profile updated successfully"));
        } catch (Exception e) {
            logger.error("User update failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ================= PRIVATE METHODS =================

    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header");
        }
        return authHeader.substring(7);
    }
}
