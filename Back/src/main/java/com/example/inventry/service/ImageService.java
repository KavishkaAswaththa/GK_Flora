package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.ImageRepository;
import com.example.inventry.repo.InventoryRepo;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSUploadStream;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;


@Service
public class ImageService {


    @Autowired
    private GridFSBucket gridFSBucket;

    @Autowired
    private InventoryRepo repo;

    @Autowired
    private ImageRepository imageRepository;





    public ObjectId uploadImage(MultipartFile file) throws IOException {
        // Create GridFS upload stream and save the file
        InputStream inputStream = file.getInputStream();
        GridFSUploadStream uploadStream = gridFSBucket.openUploadStream(file.getOriginalFilename());
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            uploadStream.write(buffer, 0, bytesRead);
        }
        uploadStream.close();

        // Return the ObjectId of the uploaded file
        return uploadStream.getObjectId();
    }





    public String getImageUrlById(String imageId) {
        GridFSFile file = gridFSBucket.find().first();
        if (file != null) {
            return file.getId().toString();
        }
        return null;
    }


    public String getStudentByID(String studentid) {
        Optional<Inventory> inventory = repo.findById(studentid);
        String imageId = inventory.get().getImageId();

        return imageId;
    }

    public byte[] getImageById(String id) throws Exception {
        return imageRepository.downloadImage(id);
    }

}

