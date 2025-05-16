package com.example.inventry.service;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.repo.WrappingPaperRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class WrappingPaperService {

    private final WrappingPaperRepository wrappingPaperRepository;

    public WrappingPaperService(WrappingPaperRepository wrappingPaperRepository) {
        this.wrappingPaperRepository = wrappingPaperRepository;
    }

    public WrappingPaper addWrappingPaper(MultipartFile image, Double price) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Wrapping paper image cannot be empty.");
        }

        if (price == null || price < 0) {
            throw new IllegalArgumentException("Wrapping paper price must be a positive number.");
        }

        // Convert image to Base64
        byte[] imageBytes = IOUtils.toByteArray(image.getInputStream());
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        // Create and save WrappingPaper entity
        WrappingPaper wrappingPaper = new WrappingPaper();
        wrappingPaper.setImageBase64(base64Image);
        wrappingPaper.setPrice(price);

        return wrappingPaperRepository.save(wrappingPaper);
    }

    public List<WrappingPaper> getAllWrappingPapers() {
        return wrappingPaperRepository.findAll();
    }
}
