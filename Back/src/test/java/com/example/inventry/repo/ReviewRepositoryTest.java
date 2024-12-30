package com.example.inventry.repo;

import com.example.inventry.entity.Review;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

@ExtendWith(SpringExtension.class)
@DataMongoTest
public class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    private Review review1;
    private Review review2;

    @BeforeEach
    public void setUp() {
        // Initialize test data
        review1 = new Review();
        review1.setItemId("item123");
        review1.setRating(5);
        review1.setComment("Excellent product!");

        review2 = new Review();
        review2.setItemId("item123");
        review2.setRating(4);
        review2.setComment("Good product but could be improved.");

        // Save reviews to the repository
        reviewRepository.save(review1);
        reviewRepository.save(review2);
    }

    @Test
    public void testFindByItemId() {
        // Act: Retrieve reviews by itemId
        List<Review> reviews = reviewRepository.findByItemId("item123");

        // Assert: Verify that the retrieved reviews match the expected results
        assertThat(reviews).isNotEmpty();
        assertThat(reviews).hasSize(2);

        // Verify that both reviews have the expected itemId
        assertThat(reviews.get(0).getItemId()).isEqualTo("item123");
        assertThat(reviews.get(1).getItemId()).isEqualTo("item123");

        // Optionally verify other attributes like rating and comment
        assertThat(reviews.get(0).getRating()).isEqualTo(5);
        assertThat(reviews.get(0).getComment()).isEqualTo("Excellent product!");
    }

    @Test
    public void testFindByItemId_NoReviewsFound() {
        // Act: Retrieve reviews for a non-existent itemId
        List<Review> reviews = reviewRepository.findByItemId("item999");

        // Assert: Verify that no reviews are returned
        assertThat(reviews).isEmpty();
    }
}
