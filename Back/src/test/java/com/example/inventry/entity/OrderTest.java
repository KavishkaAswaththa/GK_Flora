package com.example.inventry.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderTest {

    @Test
    void testDefaultConstructor() {
        Order order = new Order();

        assertNull(order.get_id());
        assertNull(order.getname());
        assertNull(order.getqty());
        assertNull(order.getprice());
        assertNull(order.gettracking());
    }

    @Test
    void testParameterizedConstructor() {
        Order order = new Order("1", "Sample Item", "10", "100", "Shipped");

        assertEquals("1", order.get_id());
        assertEquals("Sample Item", order.getname());
        assertEquals("10", order.getqty());
        assertEquals("100", order.getprice());
        assertEquals("Shipped", order.gettracking());
    }

    @Test
    void testSettersAndGetters() {
        Order order = new Order();

        order.set_id("1");
        order.setname("Sample Item");
        order.setqty("10");
        order.setprice("100");
        order.settracking("Shipped");

        assertEquals("1", order.get_id());
        assertEquals("Sample Item", order.getname());
        assertEquals("10", order.getqty());
        assertEquals("100", order.getprice());
        assertEquals("Shipped", order.gettracking());
    }

    @Test
    void testToString() {
        Order order = new Order("1", "Sample Item", "10", "100", "Shipped");

        String expected = "Student{" +
                "_id='1', " +
                "studentname='Sample Item', " +
                "studentemail='10', " +
                "studentaddress='100', " +
                "mobile='Shipped'}";

        assertEquals(expected, order.toString());
    }
}
