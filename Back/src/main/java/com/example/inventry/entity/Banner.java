package com.example.inventry.entity;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter

@Document("banners")
public class Banner {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private boolean available;
}