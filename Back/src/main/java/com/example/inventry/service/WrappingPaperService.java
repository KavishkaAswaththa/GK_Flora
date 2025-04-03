package com.example.inventry.service;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.repo.WrappingPaperRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class WrappingPaperService {
    private final WrappingPaperRepository wrappingPaperRepository;
    private static final String UPLOAD_DIR = "uploads/wrappingPapers/";

    public WrappingPaperService(WrappingPaperRepository wrappingPaperRepository) {
        this.wrappingPaperRepository = wrappingPaperRepository;
    }

    public WrappingPaper addWrappingPaper(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Wrapping paper image cannot be empty.");
        }

        // ✅ Generate unique filename
        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);

        // ✅ Ensure directory exists
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // ✅ Save image to file system
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ Save wrapping paper details in database
        WrappingPaper wrappingPaper = new WrappingPaper();
        wrappingPaper.setImageUrl("/uploads/wrappingPapers/" + filename); // Relative path for frontend

        return wrappingPaperRepository.save(wrappingPaper);
    }

    public List<WrappingPaper> getAllWrappingPapers() {
        return wrappingPaperRepository.findAll();
    }
}
