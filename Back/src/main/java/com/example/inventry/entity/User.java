package com.example.inventry.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    @Builder.Default
    private Boolean isAccountVerified = false;

    private String resetOtp;
    private Long resetOtpExpireAt;

    // Additional profile fields
    private String mobileNo;
    private String birthday;
    private String avatarType; // e.g., "male", "female"

    private Address address; // Embedded Address class
}
