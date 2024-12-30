package com.example.inventry.repo;

import com.example.inventry.entity.Delivery;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class DeliveryRepoTest {

    @Autowired
    private DeliveryRepo deliveryRepo;

    @Test
    void testSaveAndFindDelivery() {
        Delivery delivery = new Delivery(
                null, "John Doe", "1234567890", "123 Street", "New York",
                "2024-11-30", "10:00 AM", "Jane Smith", "0987654321");
        Delivery savedDelivery = deliveryRepo.save(delivery);

        Delivery foundDelivery = deliveryRepo.findById(savedDelivery.get_id()).orElse(null);
        assertThat(foundDelivery).isNotNull();
        assertThat(foundDelivery.getName()).isEqualTo("John Doe");
    }

    @Test
    void testDeleteDelivery() {
        Delivery delivery = new Delivery(
                null, "Jane Doe", "0987654321", "456 Street", "Los Angeles",
                "2024-12-01", "2:00 PM", "John Smith", "1234567890");
        Delivery savedDelivery = deliveryRepo.save(delivery);

        deliveryRepo.deleteById(savedDelivery.get_id());
        assertThat(deliveryRepo.findById(savedDelivery.get_id())).isEmpty();
    }
}
