package com.example.inventry.controller;

import com.example.inventry.entity.Category;
import com.example.inventry.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryService service;

    @GetMapping
    public List<Category> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable String id) {
        return service.getCategoryById(id);
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return service.addCategory(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category category) {
        return service.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable String id) {
        service.deleteCategory(id);
    }

    @PostMapping("/{id}/faqs")
    public ResponseEntity<Category> addFaqToCategory(@PathVariable String id, @RequestBody String faq) {
        Category updatedCategory = service.addFaqToCategory(id, faq);
        return updatedCategory != null ? ResponseEntity.ok(updatedCategory) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/faqs/{index}")
    public ResponseEntity<Category> updateFaqInCategory(@PathVariable String id, @PathVariable int index, @RequestBody String faq) {
        Category updatedCategory = service.updateFaqInCategory(id, index, faq);
        return updatedCategory != null ? ResponseEntity.ok(updatedCategory) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/faqs/{index}")
    public ResponseEntity<Category> deleteFaqFromCategory(@PathVariable String id, @PathVariable int index) {
        Category updatedCategory = service.deleteFaqFromCategory(id, index);
        return updatedCategory != null ? ResponseEntity.ok(updatedCategory) : ResponseEntity.notFound().build();
    }
}
