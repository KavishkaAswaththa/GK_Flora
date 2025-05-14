package com.example.inventry.controller;

import com.example.inventry.entity.User;
import com.example.inventry.repo.UserRepository;
import com.example.inventry.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        exposedHeaders = "Authorization",
        allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                System.out.println("Invalid Authorization header: " + token);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Invalid Authorization header"
                ));
            }

            String tokenString = token.substring(7);
            String email = jwtService.extractUsername(tokenString);
            System.out.println("Extracted email from token: " + email);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

            System.out.println("Found user: " + user.getEmail());

            // Using HashMap instead of Map.of() to handle null values
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getName());
            userResponse.put("email", user.getEmail());
            userResponse.put("isAccountVerified", user.getIsAccountVerified() != null ? user.getIsAccountVerified() : false);
            userResponse.put("mobileNo", user.getMobileNo() != null ? user.getMobileNo() : "");
            userResponse.put("birthday", user.getBirthday() != null ? user.getBirthday() : "");
            userResponse.put("avatarType", user.getAvatarType() != null ? user.getAvatarType() : "");
            userResponse.put("address", user.getAddress() != null ? user.getAddress() : "");

            return ResponseEntity.ok(userResponse);
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Expired token"
            ));
        } catch (MalformedJwtException e) {
            System.err.println("Malformed token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Malformed token"
            ));
        } catch (UnsupportedJwtException e) {
            System.err.println("Unsupported token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Unsupported token"
            ));
        } catch (JwtException e) {
            System.err.println("Invalid token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid token"
            ));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token, @RequestBody User updatedUser) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Invalid Authorization header"
                ));
            }

            String email = jwtService.extractUsername(token.substring(7));
            User existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            existingUser.setName(updatedUser.getName());
            existingUser.setMobileNo(updatedUser.getMobileNo());
            existingUser.setBirthday(updatedUser.getBirthday());
            existingUser.setAvatarType(updatedUser.getAvatarType());
            existingUser.setAddress(updatedUser.getAddress());

            userRepository.save(existingUser);

            return ResponseEntity.ok(existingUser);
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Expired token"
            ));
        } catch (MalformedJwtException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Malformed token"
            ));
        } catch (UnsupportedJwtException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Unsupported token"
            ));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid token"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to update profile"
            ));
        }
    }
}