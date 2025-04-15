package com.example.inventry.service;

import com.example.inventry.entity.WrappingPaper;
import com.example.inventry.repo.WrappingPaperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WrappingPaperService {

    private final WrappingPaperRepository wrappingPaperRepository;

    public WrappingPaperService(WrappingPaperRepository wrappingPaperRepository) {
        this.wrappingPaperRepository = wrappingPaperRepository;
    }

    public WrappingPaper save(WrappingPaper wrappingPaper) {
        return wrappingPaperRepository.save(wrappingPaper);
    }

    public List<WrappingPaper> getAllWrappingPapers() {
        return wrappingPaperRepository.findAll();
    }

    public WrappingPaper getById(String id) {
        return wrappingPaperRepository.findById(id).orElse(null);
    }

    public boolean deleteWrappingPaperById(String id) {
        if (wrappingPaperRepository.existsById(id)) {
            wrappingPaperRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
