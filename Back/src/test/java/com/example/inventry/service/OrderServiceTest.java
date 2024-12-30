package com.example.inventry.service;

import com.example.inventry.entity.Order;
import com.example.inventry.repo.OrderRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collection;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock
    private OrderRepo orderRepo;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveOrUpdate() {
        Order order = new Order("1", "Item A", "10", "200", "Shipped");
        when(orderRepo.save(order)).thenReturn(order);

        orderService.saveorUpdate(order);

        verify(orderRepo, times(1)).save(order);
    }

    @Test
    void testListAll() {
        Order order1 = new Order("1", "Item A", "10", "200", "Shipped");
        Order order2 = new Order("2", "Item B", "5", "100", "Processing");
        when(orderRepo.findAll()).thenReturn(Arrays.asList(order1, order2));

        Iterable<Order> orders = orderService.listAll();

        assertNotNull(orders);
        assertEquals(2, ((Collection<?>) orders).size());
        verify(orderRepo, times(1)).findAll();
    }

    @Test
    void testDeleteStudent() {
        String orderId = "1";

        doNothing().when(orderRepo).deleteById(orderId);

        orderService.deleteStudent(orderId);

        verify(orderRepo, times(1)).deleteById(orderId);
    }

    @Test
    void testGetStudentByID() {
        String orderId = "1";
        Order order = new Order(orderId, "Item A", "10", "200", "Shipped");
        when(orderRepo.findById(orderId)).thenReturn(Optional.of(order));

        Order fetchedOrder = orderService.getStudentByID(orderId);

        assertNotNull(fetchedOrder);
        assertEquals(orderId, fetchedOrder.get_id());
        assertEquals("Item A", fetchedOrder.getname());
        verify(orderRepo, times(1)).findById(orderId);
    }

    @Test
    void testGetStudentByID_NotFound() {
        String orderId = "1";
        when(orderRepo.findById(orderId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> {
            orderService.getStudentByID(orderId);
        });

        assertTrue(exception instanceof NoSuchElementException);
        verify(orderRepo, times(1)).findById(orderId);
    }
}

