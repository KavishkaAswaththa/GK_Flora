package com.example.inventry.service;

import com.example.inventry.entity.Review;
import com.example.inventry.repo.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByItemId(String itemId) {
        return reviewRepository.findByItemId(itemId);
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + id));
    }

    public Review updateReview(String id, Review updatedReview) {
        Review existingReview = getReviewById(id);
        existingReview.setReviewerName(updatedReview.getReviewerName());
        existingReview.setComment(updatedReview.getComment());
        existingReview.setRating(updatedReview.getRating());
        existingReview.setItemId(updatedReview.getItemId());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}
