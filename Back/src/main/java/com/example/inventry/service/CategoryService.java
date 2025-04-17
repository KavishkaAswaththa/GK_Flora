package com.example.inventry.service;

import com.example.inventry.entity.Category;
import com.example.inventry.repo.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    public Category getCategoryById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Category addCategory(Category category) {
        return repository.save(category);
    }

    public Category updateCategory(String id, Category updatedCategory) {
        Optional<Category> categoryData = repository.findById(id);
        if (categoryData.isPresent()) {
            Category category = categoryData.get();
            category.setTitle(updatedCategory.getTitle());
           
            category.setItems(updatedCategory.getItems());
            return repository.save(category);
        }
        return null;
    }

    public void deleteCategory(String id) {
        repository.deleteById(id);
    }

    // Add a new FAQ to a category
    public Category addFaqToCategory(String id, String faq) {
        Optional<Category> categoryData = repository.findById(id);
        if (categoryData.isPresent()) {
            Category category = categoryData.get();
            category.getItems().add(faq); // Add the FAQ
            return repository.save(category);
        }
        return null;
    }

    // Update an FAQ in a category
    public Category updateFaqInCategory(String id, int index, String faq) {
        Optional<Category> categoryData = repository.findById(id);
        if (categoryData.isPresent()) {
            Category category = categoryData.get();
            category.getItems().set(index, faq); // Update the FAQ at index
            return repository.save(category);
        }
        return null;
    }

    // Delete an FAQ from a category
    public Category deleteFaqFromCategory(String id, int index) {
        Optional<Category> categoryData = repository.findById(id);
        if (categoryData.isPresent()) {
            Category category = categoryData.get();
            category.getItems().remove(index); // Remove the FAQ at index
            return repository.save(category);
        }
        return null;
    }
}
