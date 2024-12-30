package com.example.inventry.controller;



import com.example.inventry.entity.Order;
import com.example.inventry.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/student")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping(value = "/save")
    private String saveStudent(@RequestBody Order students) {

        orderService.saveorUpdate(students);
        return students.get_id();
    }

    @GetMapping(value = "/getall")
    public Iterable<Order> getStudents() {
        return orderService.listAll();
    }

    @PutMapping(value = "/edit/{id}")
    private Order update(@RequestBody Order order, @PathVariable(name = "id") String _id) {
        order.set_id(_id);
        orderService.saveorUpdate(order);
        return order;
    }

    @DeleteMapping("/delete/{id}")
    private void deleteStudent(@PathVariable("id") String _id) {
        orderService.deleteStudent(_id);
    }


    @RequestMapping("/search/{id}")
    private Order getStudents(@PathVariable(name = "id") String studentid) {
        return orderService.getStudentByID(studentid);
    }

}