package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "inventory")
public class Inventory {

    @Id
    private String _id;

    private String name;
    private String category;
    private List<String> imageIds;
    private String description;
    private Double price;
    private int qty;

    // ✅ Just define it as a List — no annotation needed for MongoDB
    private List<String> bloomContains = new ArrayList<>();

    public Inventory() {
    }

    public Inventory(String _id, String name, String category, String description, Double price, int qty, List<String> bloomContains, List<String> imageIds) {
        this._id = _id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.qty = qty;
        this.bloomContains = bloomContains;
        this.imageIds = imageIds;
    }

    // Getters and setters

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

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public List<String> getBloomContains() {
        return bloomContains;
    }

    public void setBloomContains(List<String> bloomContains) {
        this.bloomContains = bloomContains;
    }
}
