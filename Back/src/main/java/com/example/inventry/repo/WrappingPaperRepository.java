package com.example.inventry.repo;

import com.example.inventry.entity.WrappingPaper;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WrappingPaperRepository extends MongoRepository<WrappingPaper, String> {}