package com.example.inventry.service;

import com.example.inventry.entity.Delivery;
import com.example.inventry.repo.DeliveryRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class DeliveryServicesTest {

    @InjectMocks
    private DeliveryServices deliveryServices;

    @Mock
    private DeliveryRepo deliveryRepo;

    private Delivery mockDelivery;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockDelivery = new Delivery(
                "1", "Alice", "1111111111", "789 Street", "Chicago",
                "2024-11-25", "5:00 PM", "Bob", "2222222222");
    }

    @Test
    void testSaveOrUpdate() {
        when(deliveryRepo.save(mockDelivery)).thenReturn(mockDelivery);

        deliveryServices.saveorUpdate(mockDelivery);
        verify(deliveryRepo, times(1)).save(mockDelivery);
    }

    @Test
    void testGetDeliveryByID() {
        when(deliveryRepo.findById("1")).thenReturn(Optional.of(mockDelivery));

        Delivery foundDelivery = deliveryServices.getDeliveryByID("1");
        assertThat(foundDelivery).isNotNull();
        assertThat(foundDelivery.getName()).isEqualTo("Alice");
    }

    @Test
    void testDeleteDelivery() {
        doNothing().when(deliveryRepo).deleteById("1");

        deliveryServices.deleteDelivery("1");
        verify(deliveryRepo, times(1)).deleteById("1");
    }
}
