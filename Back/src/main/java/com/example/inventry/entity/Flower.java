package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "flowers")
public class Flower {
    @Id
    private String id;
    private String name;
    private String imageUrl;

    public Flower() {}

    public Flower(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }

    // ✅ Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // ✅ Setters (Added to fix errors)
    public void setName(String name) {
        this.name = name;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}