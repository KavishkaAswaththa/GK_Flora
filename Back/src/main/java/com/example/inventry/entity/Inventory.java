package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "inventory") // Marks it as a MongoDB document
public class Inventory {
    @Id
    private String _id;
    private String name;
    private String category;
    private List<String> imageIds; // Updated to store multiple image IDs
    private String description;
    private Double price;
    private String bloomContains;

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getImageIds() {
        return imageIds;
    }

    public void setImageIds(List<String> imageIds) {
        this.imageIds = imageIds;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getBloomContains() {
        return bloomContains;
    }

    public void setBloomContains(String bloomContains) {
        this.bloomContains = bloomContains;
    }
}
