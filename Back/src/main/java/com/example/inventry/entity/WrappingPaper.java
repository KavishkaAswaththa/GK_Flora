package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "wrappingPapers")
public class WrappingPaper {

    @Id
    private String id;

    private List<String> imageIds;

    public WrappingPaper() {
    }

    public WrappingPaper(List<String> imageIds) {
        this.imageIds = imageIds;
    }

    // ✅ Getters
    public String getId() {
        return id;
    }

    public List<String> getImageIds() {
        return imageIds;
    }

    // ✅ Setters
    public void setImageIds(List<String> imageIds) {
        this.imageIds = imageIds;
    }
}
