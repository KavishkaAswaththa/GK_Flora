package com.example.inventry.controller;

import com.example.inventry.entity.User;
import com.example.inventry.repo.UserRepository;
import com.example.inventry.service.JwtService;
import com.example.inventry.service.UserService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
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
    private final UserService userService;

    // Utility method to extract email from token
    private String extractEmailFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new JwtException("Invalid Authorization header");
        }
        return jwtService.extractUsername(token.substring(7));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String email = extractEmailFromToken(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getName());
            userResponse.put("email", user.getEmail());
            userResponse.put("isAccountVerified", user.getIsAccountVerified() != null ? user.getIsAccountVerified() : false);
            userResponse.put("mobileNo", user.getMobileNo() != null ? user.getMobileNo() : "");
            userResponse.put("birthday", user.getBirthday() != null ? user.getBirthday() : "");
            userResponse.put("address", user.getAddress() != null ? user.getAddress() : "");

            if (user.getProfileImage() != null) {
                String base64Image = Base64.getEncoder().encodeToString(user.getProfileImage());
                userResponse.put("profileImage", "data:image/jpeg;base64," + base64Image);
            } else {
                userResponse.put("profileImage", "");
            }

            return ResponseEntity.ok(userResponse);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred: " + e.getMessage()
            ));
        }
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestPart("user") User updatedUser,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            String email = extractEmailFromToken(token);
            User existingUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            existingUser.setName(updatedUser.getName());
            existingUser.setMobileNo(updatedUser.getMobileNo());
            existingUser.setBirthday(updatedUser.getBirthday());
            existingUser.setAvatarType(updatedUser.getAvatarType());
            existingUser.setAddress(updatedUser.getAddress());

            if (profileImage != null && !profileImage.isEmpty()) {
                existingUser.setProfileImage(profileImage.getBytes());
            }

            userRepository.save(existingUser);

            Map<String, Object> updatedResponse = new HashMap<>();
            updatedResponse.put("name", existingUser.getName());
            updatedResponse.put("email", existingUser.getEmail());
            updatedResponse.put("mobileNo", existingUser.getMobileNo());
            updatedResponse.put("birthday", existingUser.getBirthday());
            updatedResponse.put("avatarType", existingUser.getAvatarType());
            updatedResponse.put("address", existingUser.getAddress());

            if (existingUser.getProfileImage() != null) {
                String base64Image = Base64.getEncoder().encodeToString(existingUser.getProfileImage());
                updatedResponse.put("profileImage", "data:image/jpeg;base64," + base64Image);
            } else {
                updatedResponse.put("profileImage", "");
            }

            return ResponseEntity.ok(updatedResponse);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Failed to update profile"));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to retrieve users"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable String id) {
        try {
            boolean deleted = userService.deleteUserById(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to delete user"));
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            boolean deleted = userService.deleteUserByEmail(email);
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to delete user"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserByEmail(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Failed to retrieve user"));
        }
    }

}
