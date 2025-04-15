package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wrappingPapers")
public class WrappingPaper {
    @Id
    private String id;
    private String imageUrl;

    public WrappingPaper() {}

    public WrappingPaper(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // ✅ Getters
    public String getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // ✅ Setter for imageUrl
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}