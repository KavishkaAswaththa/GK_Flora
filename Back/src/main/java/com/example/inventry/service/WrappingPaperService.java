package com.example.inventry.service;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.repo.WrappingPaperRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class WrappingPaperService {

    private final WrappingPaperRepository wrappingPaperRepository;

    public WrappingPaperService(WrappingPaperRepository wrappingPaperRepository) {
        this.wrappingPaperRepository = wrappingPaperRepository;
    }

    // CREATE
    public WrappingPaper addWrappingPaper(MultipartFile image, Double price) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Wrapping paper image cannot be empty.");
        }

        if (price == null || price < 0) {
            throw new IllegalArgumentException("Wrapping paper price must be a positive number.");
        }

        byte[] imageBytes = IOUtils.toByteArray(image.getInputStream());
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        WrappingPaper wrappingPaper = new WrappingPaper();
        wrappingPaper.setImageBase64(base64Image);
        wrappingPaper.setPrice(price);

        return wrappingPaperRepository.save(wrappingPaper);
    }

    // READ
    public List<WrappingPaper> getAllWrappingPapers() {
        return wrappingPaperRepository.findAll();
    }

    // UPDATE
    public WrappingPaper updateWrappingPaper(String id, MultipartFile image, Double price) throws IOException {
        Optional<WrappingPaper> optional = wrappingPaperRepository.findById(id);
        if (optional.isEmpty()) {
            throw new IllegalArgumentException("Wrapping paper with ID " + id + " not found.");
        }

        WrappingPaper wrappingPaper = optional.get();

        if (image != null && !image.isEmpty()) {
            byte[] imageBytes = IOUtils.toByteArray(image.getInputStream());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            wrappingPaper.setImageBase64(base64Image);
        }

        if (price != null && price >= 0) {
            wrappingPaper.setPrice(price);
        } else {
            throw new IllegalArgumentException("Wrapping paper price must be a positive number.");
        }

        return wrappingPaperRepository.save(wrappingPaper);
    }

    // DELETE
    public void deleteWrappingPaper(String id) {
        if (!wrappingPaperRepository.existsById(id)) {
            throw new IllegalArgumentException("Wrapping paper with ID " + id + " does not exist.");
        }
        wrappingPaperRepository.deleteById(id);
    }
}
