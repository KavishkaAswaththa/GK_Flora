package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wrappingPapers")
public class WrappingPaper {

    @Id
    private String id;

    private String imageBase64;

    public WrappingPaper() {}

    public WrappingPaper(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getId() {
        return id;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
}
