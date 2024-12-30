package com.example.inventry.service;

import com.example.inventry.entity.Review;
import com.example.inventry.repo.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review review1;
    private Review review2;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Sample review data
        review1 = new Review();
        review1.setId("1");
        review1.setItemId("item123");
        review1.setReviewerName("Alice");
        review1.setComment("Great product!");
        review1.setRating(5);

        review2 = new Review();
        review2.setId("2");
        review2.setItemId("item123");
        review2.setReviewerName("Bob");
        review2.setComment("Good quality, but expensive.");
        review2.setRating(3);
    }

    @Test
    public void testAddReview() {
        when(reviewRepository.save(review1)).thenReturn(review1);

        Review result = reviewService.addReview(review1);

        assertNotNull(result);
        assertEquals("Great product!", result.getComment());
        assertEquals(5, result.getRating());
        verify(reviewRepository, times(1)).save(review1);
    }

    @Test
    public void testGetAllReviews() {
        when(reviewRepository.findAll()).thenReturn(Arrays.asList(review1, review2));

        List<Review> reviews = reviewService.getAllReviews();

        assertNotNull(reviews);
        assertEquals(2, reviews.size());
        assertTrue(reviews.contains(review1));
        assertTrue(reviews.contains(review2));
        verify(reviewRepository, times(1)).findAll();
    }

    @Test
    public void testGetReviewsByItemId() {
        when(reviewRepository.findByItemId("item123")).thenReturn(Arrays.asList(review1, review2));

        List<Review> reviews = reviewService.getReviewsByItemId("item123");

        assertNotNull(reviews);
        assertEquals(2, reviews.size());
        assertTrue(reviews.contains(review1));
        assertTrue(reviews.contains(review2));
        verify(reviewRepository, times(1)).findByItemId("item123");
    }

    @Test
    public void testGetReviewById() {
        when(reviewRepository.findById("1")).thenReturn(Optional.of(review1));

        Review result = reviewService.getReviewById("1");

        assertNotNull(result);
        assertEquals("Alice", result.getReviewerName());
        assertEquals("Great product!", result.getComment());
        verify(reviewRepository, times(1)).findById("1");
    }

    @Test
    public void testGetReviewById_NotFound() {
        when(reviewRepository.findById("1")).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> reviewService.getReviewById("1"));

        assertEquals("Review not found with ID: 1", exception.getMessage());
        verify(reviewRepository, times(1)).findById("1");
    }

    @Test
    public void testUpdateReview() {
        when(reviewRepository.findById("1")).thenReturn(Optional.of(review1));
        when(reviewRepository.save(review1)).thenReturn(review1);

        Review updatedReview = new Review();
        updatedReview.setReviewerName("Alice Updated");
        updatedReview.setComment("Updated comment");
        updatedReview.setRating(4);
        updatedReview.setItemId("item123");

        Review result = reviewService.updateReview("1", updatedReview);

        assertNotNull(result);
        assertEquals("Alice Updated", result.getReviewerName());
        assertEquals("Updated comment", result.getComment());
        assertEquals(4, result.getRating());
        verify(reviewRepository, times(1)).save(review1);
        verify(reviewRepository, times(1)).findById("1");
    }

    @Test
    public void testDeleteReview() {
        doNothing().when(reviewRepository).deleteById("1");

        reviewService.deleteReview("1");

        verify(reviewRepository, times(1)).deleteById("1");
    }
}
