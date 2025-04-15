package com.example.inventry.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    @JsonCreator
    public Address(String addressString) {
        // Basic parsing logic
        this.streetAddress = addressString;
    }
}
