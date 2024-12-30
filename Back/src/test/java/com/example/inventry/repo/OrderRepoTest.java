package com.example.inventry.repo;

import com.example.inventry.entity.Order;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.Collection;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
class OrderRepoTest {

    @Autowired
    private OrderRepo orderRepo;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        orderRepo.deleteAll();
    }

    @AfterEach
    void tearDown() {
        // Clean database after each test
        orderRepo.deleteAll();
    }

    @Test
    void testSaveOrder() {
        Order order = new Order("1", "Item A", "5", "100", "Shipped");
        Order savedOrder = orderRepo.save(order);

        assertNotNull(savedOrder);
        assertEquals("1", savedOrder.get_id());
        assertEquals("Item A", savedOrder.getname());
        assertEquals("5", savedOrder.getqty());
        assertEquals("100", savedOrder.getprice());
        assertEquals("Shipped", savedOrder.gettracking());
    }

    @Test
    void testFindById() {
        Order order = new Order("1", "Item A", "5", "100", "Shipped");
        orderRepo.save(order);

        Optional<Order> fetchedOrder = orderRepo.findById("1");
        assertTrue(fetchedOrder.isPresent());
        assertEquals("Item A", fetchedOrder.get().getname());
    }

    @Test
    void testDeleteOrder() {
        Order order = new Order("1", "Item A", "5", "100", "Shipped");
        orderRepo.save(order);

        orderRepo.deleteById("1");
        Optional<Order> fetchedOrder = orderRepo.findById("1");
        assertFalse(fetchedOrder.isPresent());
    }

    @Test
    void testFindAll() {
        Order order1 = new Order("1", "Item A", "5", "100", "Shipped");
        Order order2 = new Order("2", "Item B", "3", "50", "Processing");

        orderRepo.save(order1);
        orderRepo.save(order2);

        Iterable<Order> orders = orderRepo.findAll();
        assertNotNull(orders);
        assertEquals(2, ((Collection<?>) orders).size());
    }
}
