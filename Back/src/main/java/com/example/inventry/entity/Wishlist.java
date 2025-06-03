package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlist")
public class Wishlist {

    @Id
    private String id;
    private String userEmail;
    private String itemId;

    public Wishlist() {}

    public Wishlist(String userEmail, String itemId) {
        this.userEmail = userEmail;
        this.itemId = itemId;
    }

    // Getters and setters
    public String getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
}
