package com.example.inventry.repo;

import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;

@Repository
public class ImageRepository {

    @Autowired
    GridFSBucket gridFSBucket;

    public byte[] downloadImage(String id) throws Exception {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            gridFSBucket.downloadToStream(new ObjectId(id), outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new Exception("Error retrieving image", e);
        }
    }
}
