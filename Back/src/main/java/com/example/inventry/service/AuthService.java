package com.example.inventry.service;

import com.example.inventry.entity.AuthResponse;
import com.example.inventry.entity.LoginRequest;
import com.example.inventry.entity.RegisterRequest;
import com.example.inventry.entity.User;
import com.example.inventry.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.JwtException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsAccountVerified(true); // Set to true by default since we removed verification
        userRepository.save(user);
        String token = jwtService.generateToken(user.getId().toString(), user.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email!"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        String token = jwtService.generateToken(user.getId().toString(), user.getEmail());
        return new AuthResponse(token);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // Logout logic (invalidate token if using session-based auth)
    }

    public Boolean isAuthenticated(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return false;
            }
            jwtService.validateToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String sendResetOtp(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found!"));
        String otp = generateOtp();
        user.setResetOtp(otp);
        user.setResetOtpExpireAt(System.currentTimeMillis() + 600000); // 10 minutes
        userRepository.save(user);
        
        // Send OTP via email
        String emailBody = String.format(
            "Dear %s,\n\nYour password reset OTP is: %s\n\nThis OTP will expire in 10 minutes.\n\nBest regards,\nYour App Team",
            user.getName(), otp
        );
        
        emailService.sendEmail(user.getEmail(), "Password Reset OTP", emailBody);
        return "Reset OTP sent to email!";
    }

    public String resetPassword(String otp, String newPassword) {
        User user = userRepository.findByResetOtp(otp).orElseThrow(() -> new RuntimeException("Invalid OTP!"));
        if (user.getResetOtpExpireAt() < System.currentTimeMillis()) {
            return "OTP expired!";
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        userRepository.save(user);
        return "Password reset successfully!";
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}

