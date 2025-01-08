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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ImageService {

    @Autowired
    private GridFSBucket gridFSBucket;

    @Autowired
    private InventoryRepo inventoryRepo;

    @Autowired
    private ImageRepository imageRepository;

    /**
     * Upload a single image to GridFS and return its ObjectId.
     */
    public ObjectId uploadImage(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();
        GridFSUploadStream uploadStream = gridFSBucket.openUploadStream(file.getOriginalFilename());
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            uploadStream.write(buffer, 0, bytesRead);
        }
        uploadStream.close();

        return uploadStream.getObjectId();
    }

    /**
     * Upload multiple images to GridFS and return their ObjectIds.
     */
    public List<String> uploadImages(MultipartFile[] files) throws IOException {
        List<String> imageIds = new ArrayList<>();
        for (MultipartFile file : files) {
            ObjectId fileId = uploadImage(file);
            imageIds.add(fileId.toString());
        }
        return imageIds;
    }

    /**
     * Retrieve a list of image IDs from an inventory item.
     */
    public List<String> getImageIdsByInventoryId(String inventoryId) {
        Optional<Inventory> inventory = inventoryRepo.findById(inventoryId);
        return inventory.map(Inventory::getImageIds).orElse(new ArrayList<>());
    }

    /**
     * Retrieve a single image as a byte array by its ID.
     */
    public byte[] getImageById(String imageId) throws Exception {
        return imageRepository.downloadImage(imageId);
    }

    /**
     * Retrieve multiple images as byte arrays by their IDs.
     */
    public List<byte[]> getImagesByIds(List<String> imageIds) throws Exception {
        List<byte[]> images = new ArrayList<>();
        for (String imageId : imageIds) {
            images.add(getImageById(imageId));
        }
        return images;
    }
}
