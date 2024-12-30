package com.example.inventry.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String itemId;        // ID of the item being reviewed
    private String reviewerName;
    private String comment;
    private int rating;           // Rating out of 5
    private LocalDateTime timestamp = LocalDateTime.now();
}
