package com.example.inventry.controller;

import com.example.inventry.entity.Order;
import com.example.inventry.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
    }

    @Test
    void testSaveStudent() throws Exception {
        Order mockOrder = new Order();
        mockOrder.set_id("1");
        mockOrder.setname("Sample Name");
        mockOrder.setqty("5");
        mockOrder.setprice("100");
        mockOrder.settracking("Shipped");

        //when(orderService.saveorUpdate(any(Order.class))).thenReturn(mockOrder);

        mockMvc.perform(post("/api/v1/student/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"_id\":\"1\",\"name\":\"Sample Name\",\"qty\":\"5\",\"price\":\"100\",\"tracking\":\"Shipped\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"))
                .andDo(print());

        verify(orderService, times(1)).saveorUpdate(any(Order.class));
    }

    @Test
    void testGetAllStudents() throws Exception {
        Order order1 = new Order("1", "Item 1", "2", "50", "Pending");
        Order order2 = new Order("2", "Item 2", "4", "200", "Delivered");

        when(orderService.listAll()).thenReturn(Arrays.asList(order1, order2));

        mockMvc.perform(get("/api/v1/student/getall"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]._id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Item 1"))
                .andExpect(jsonPath("$[0].qty").value("2"))
                .andExpect(jsonPath("$[0].price").value("50"))
                .andExpect(jsonPath("$[0].tracking").value("Pending"))
                .andExpect(jsonPath("$[1]._id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Item 2"))
                .andExpect(jsonPath("$[1].qty").value("4"))
                .andExpect(jsonPath("$[1].price").value("200"))
                .andExpect(jsonPath("$[1].tracking").value("Delivered"))
                .andDo(print());

        verify(orderService, times(1)).listAll();
    }

    @Test
    void testUpdateStudent() throws Exception {
        Order updatedOrder = new Order("1", "Updated Item", "3", "150", "Shipped");

        //when(orderService.saveorUpdate(any(Order.class))).thenReturn(updatedOrder);

        mockMvc.perform(put("/api/v1/student/edit/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated Item\",\"qty\":\"3\",\"price\":\"150\",\"tracking\":\"Shipped\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._id").value("1"))
                .andExpect(jsonPath("$.name").value("Updated Item"))
                .andExpect(jsonPath("$.qty").value("3"))
                .andExpect(jsonPath("$.price").value("150"))
                .andExpect(jsonPath("$.tracking").value("Shipped"))
                .andDo(print());

        verify(orderService, times(1)).saveorUpdate(any(Order.class));
    }

    @Test
    void testDeleteStudent() throws Exception {
        doNothing().when(orderService).deleteStudent("1");

        mockMvc.perform(delete("/api/v1/student/delete/1"))
                .andExpect(status().isOk())
                .andDo(print());

        verify(orderService, times(1)).deleteStudent("1");
    }

    @Test
    void testSearchStudent() throws Exception {
        Order mockOrder = new Order("1", "Searched Item", "6", "300", "In Transit");

        when(orderService.getStudentByID("1")).thenReturn(mockOrder);

        mockMvc.perform(get("/api/v1/student/search/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._id").value("1"))
                .andExpect(jsonPath("$.name").value("Searched Item"))
                .andExpect(jsonPath("$.qty").value("6"))
                .andExpect(jsonPath("$.price").value("300"))
                .andExpect(jsonPath("$.tracking").value("In Transit"))
                .andDo(print());

        verify(orderService, times(1)).getStudentByID("1");
    }
}

