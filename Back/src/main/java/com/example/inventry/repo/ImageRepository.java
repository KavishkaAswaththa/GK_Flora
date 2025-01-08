package com.example.inventry.repo;

import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ImageRepository {

    @Autowired
    private GridFSBucket gridFSBucket;

    /**
     * Download a single image from GridFS using its ObjectId.
     */
    public byte[] downloadImage(String imageId) throws Exception {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            gridFSBucket.downloadToStream(new ObjectId(imageId), outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new Exception("Error retrieving image with ID: " + imageId, e);
        }
    }

    /**
     * Download multiple images from GridFS using their ObjectIds.
     */
    public List<byte[]> downloadImages(List<String> imageIds) throws Exception {
        List<byte[]> images = new ArrayList<>();
        for (String imageId : imageIds) {
            images.add(downloadImage(imageId));
        }
        return images;
    }
}


//package com.example.inventry.repo;
//
//import com.mongodb.client.gridfs.GridFSBucket;
//import org.bson.types.ObjectId;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//import java.io.ByteArrayOutputStream;
//
//@Repository
//public class ImageRepository {
//
//    @Autowired
//    GridFSBucket gridFSBucket;
//
//    public byte[] downloadImage(String id) throws Exception {
//        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
//            gridFSBucket.downloadToStream(new ObjectId(id), outputStream);
//            return outputStream.toByteArray();
//        } catch (Exception e) {
//            throw new Exception("Error retrieving image", e);
//        }
//    }
//}
