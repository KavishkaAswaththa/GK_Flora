package com.example.inventry.controller;

import com.example.inventry.entity.Review;
import com.example.inventry.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

public class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private Review review;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        review = new Review();
        review.setId("1");
        review.setItemId("item123");
        review.setReviewerName("John Doe");
        review.setComment("Great product!");
        review.setRating(5);
    }

    @Test
    public void testAddReview() {
        // Arrange
        when(reviewService.addReview(any(Review.class))).thenReturn(review);

        // Act
        ResponseEntity<Review> response = reviewController.addReview(review);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(review, response.getBody());
        verify(reviewService, times(1)).addReview(any(Review.class));
    }

    @Test
    public void testGetAllReviews() {
        // Arrange
        List<Review> reviews = Arrays.asList(review);
        when(reviewService.getAllReviews()).thenReturn(reviews);

        // Act
        ResponseEntity<List<Review>> response = reviewController.getAllReviews();

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(reviews, response.getBody());
        verify(reviewService, times(1)).getAllReviews();
    }

    @Test
    public void testGetReviewsByItemId() {
        // Arrange
        List<Review> reviews = Arrays.asList(review);
        String itemId = "item123";
        when(reviewService.getReviewsByItemId(itemId)).thenReturn(reviews);

        // Act
        ResponseEntity<List<Review>> response = reviewController.getReviewsByItemId(itemId);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(reviews, response.getBody());
        verify(reviewService, times(1)).getReviewsByItemId(itemId);
    }

    @Test
    public void testGetReviewById() {
        // Arrange
        String reviewId = "1";
        when(reviewService.getReviewById(reviewId)).thenReturn(review);

        // Act
        ResponseEntity<Review> response = reviewController.getReviewById(reviewId);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(review, response.getBody());
        verify(reviewService, times(1)).getReviewById(reviewId);
    }

    @Test
    public void testUpdateReview() {
        // Arrange
        String reviewId = "1";
        Review updatedReview = new Review();
        updatedReview.setItemId("item123");
        updatedReview.setReviewerName("John Doe");
        updatedReview.setComment("Updated review!");
        updatedReview.setRating(4);
        when(reviewService.updateReview(eq(reviewId), any(Review.class))).thenReturn(updatedReview);

        // Act
        ResponseEntity<Review> response = reviewController.updateReview(reviewId, updatedReview);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedReview, response.getBody());
        verify(reviewService, times(1)).updateReview(eq(reviewId), any(Review.class));
    }

    @Test
    public void testDeleteReview() {
        // Arrange
        String reviewId = "1";
        doNothing().when(reviewService).deleteReview(reviewId);

        // Act
        ResponseEntity<Void> response = reviewController.deleteReview(reviewId);

        // Assert
        assertEquals(204, response.getStatusCodeValue());
        verify(reviewService, times(1)).deleteReview(reviewId);
    }
}
