package com.example.inventry.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ReviewTest {

    private Review review;

    @BeforeEach
    public void setUp() {
        review = new Review();
        review.setId("1");
        review.setItemId("item123");
        review.setReviewerName("John Doe");
        review.setComment("Excellent product!");
        review.setRating(5);
    }

    @Test
    public void testGetId() {
        assertEquals("1", review.getId(), "ID should be '1'");
    }

    @Test
    public void testSetId() {
        review.setId("2");
        assertEquals("2", review.getId(), "ID should be updated to '2'");
    }

    @Test
    public void testGetItemId() {
        assertEquals("item123", review.getItemId(), "Item ID should be 'item123'");
    }

    @Test
    public void testSetItemId() {
        review.setItemId("item456");
        assertEquals("item456", review.getItemId(), "Item ID should be updated to 'item456'");
    }

    @Test
    public void testGetReviewerName() {
        assertEquals("John Doe", review.getReviewerName(), "Reviewer name should be 'John Doe'");
    }

    @Test
    public void testSetReviewerName() {
        review.setReviewerName("Jane Doe");
        assertEquals("Jane Doe", review.getReviewerName(), "Reviewer name should be updated to 'Jane Doe'");
    }

    @Test
    public void testGetComment() {
        assertEquals("Excellent product!", review.getComment(), "Comment should be 'Excellent product!'");
    }

    @Test
    public void testSetComment() {
        review.setComment("Good product.");
        assertEquals("Good product.", review.getComment(), "Comment should be updated to 'Good product.'");
    }

    @Test
    public void testGetRating() {
        assertEquals(5, review.getRating(), "Rating should be 5");
    }

    @Test
    public void testSetRating() {
        review.setRating(4);
        assertEquals(4, review.getRating(), "Rating should be updated to 4");
    }

    @Test
    public void testGetTimestamp() {
        assertNotNull(review.getTimestamp(), "Timestamp should not be null");
    }

    @Test
    public void testTimestampOnCreation() {
        // Ensure the timestamp is being set to the current time on object creation
        LocalDateTime timestampBefore = review.getTimestamp();
        review.setTimestamp(LocalDateTime.now().plusMinutes(1));  // Simulate time change
        LocalDateTime timestampAfter = review.getTimestamp();

        assertNotEquals(timestampBefore, timestampAfter, "Timestamp should be updated.");
    }

    @Test
    public void testDefaultConstructor() {
        Review newReview = new Review();
        assertNotNull(newReview.getTimestamp(), "Timestamp should be initialized with current time");
    }

    @Test
    public void testEqualityAndHashcode() {
        Review anotherReview = new Review();
        anotherReview.setId("1");
        anotherReview.setItemId("item123");
        anotherReview.setReviewerName("John Doe");
        anotherReview.setComment("Excellent product!");
        anotherReview.setRating(5);

        assertEquals(review, anotherReview, "Reviews should be equal when having the same values");
        assertEquals(review.hashCode(), anotherReview.hashCode(), "Hashcodes should be the same for equal reviews");
    }
}
