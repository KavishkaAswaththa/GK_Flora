package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.ImageRepository;
import com.example.inventry.repo.InventoryRepo;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSUploadStream;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ImageServiceTest {

    @InjectMocks
    private ImageService imageService;

    @Mock
    private GridFSBucket gridFSBucket;

    @Mock
    private InventoryRepo inventoryRepo;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private MultipartFile file;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadImage() throws IOException {
        // Mock the MultipartFile
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("test image data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test-image.jpg");

        // Mock the GridFSBucket and its upload stream
        GridFSUploadStream mockUploadStream = mock(GridFSUploadStream.class);
        when(gridFSBucket.openUploadStream(anyString())).thenReturn(mockUploadStream);

        // Mock the ObjectId returned by the upload stream
        ObjectId mockObjectId = new ObjectId();
        when(mockUploadStream.getObjectId()).thenReturn(mockObjectId);

        // Test the uploadImage method
        ObjectId uploadedImageId = imageService.uploadImage(file);

        // Verify interactions and results
        verify(mockUploadStream, atLeastOnce()).write(any(byte[].class), anyInt(), anyInt());
        verify(mockUploadStream, times(1)).close();
        assertEquals(mockObjectId, uploadedImageId);
    }

    @Test
    void testGetImageUrlById() {
        // Mock the GridFSFile and its ID
        ObjectId mockObjectId = new ObjectId();
        GridFSFile mockGridFSFile = mock(GridFSFile.class);
        //when(mockGridFSFile.getId()).thenReturn(mockObjectId);

        // Mock the GridFSBucket to return a GridFSFile
        /*when(gridFSBucket.find()).thenReturn(new com.mongodb.client.MongoCursor<GridFSFile>() {
            boolean isFirst = true;

            @Override
            public boolean hasNext() {
                return isFirst;
            }

            @Override
            public GridFSFile next() {
                isFirst = false;
                return mockGridFSFile;
            }

            @Override
            public void close() {
            }

            // Unused cursor methods
            @Override
            public GridFSFile tryNext() {
                return null;
            }

            @Override
            public void forEachRemaining(java.util.function.Consumer<? super GridFSFile> action) {
            }
        }
        );*/

        // Test the getImageUrlById method
        String imageUrl = imageService.getImageUrlById("someId");

        // Verify results
        assertNotNull(imageUrl);
        assertEquals(mockObjectId.toString(), imageUrl);
    }

    @Test
    void testGetStudentByID() {
        // Mock the repository to return an inventory
        Inventory mockInventory = new Inventory();
        mockInventory.set_id("student123");
        mockInventory.setImageId("image123");
        when(inventoryRepo.findById("student123")).thenReturn(Optional.of(mockInventory));

        // Test the getStudentByID method
        String imageId = imageService.getStudentByID("student123");

        // Verify results
        assertNotNull(imageId);
        assertEquals("image123", imageId);
    }

    @Test
    void testGetImageById() throws Exception {
        // Mock the ImageRepository to return image data
        byte[] mockImageData = "test image data".getBytes();
        when(imageRepository.downloadImage("image123")).thenReturn(mockImageData);

        // Test the getImageById method
        byte[] imageData = imageService.getImageById("image123");

        // Verify results
        assertNotNull(imageData);
        assertArrayEquals(mockImageData, imageData);
    }
}
