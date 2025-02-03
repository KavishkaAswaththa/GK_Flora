package com.example.inventry.repo;

import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ImageRepositoryTest {

    @Mock
    private GridFSBucket gridFSBucket;

    @InjectMocks
    private ImageRepository imageRepository;

    private final String testImageId = "60d5f9e3b4d9c40015a3b2e6";
    private final byte[] testImageData = "test image data".getBytes();

    @BeforeEach
    void setUp() {
        lenient().doAnswer(invocation -> {
            ByteArrayOutputStream outputStream = invocation.getArgument(1);
            outputStream.write(testImageData);
            return null;
        }).when(gridFSBucket).downloadToStream(any(ObjectId.class), any(ByteArrayOutputStream.class));
    }

    @Test
    public void testDownloadImage() throws Exception {
        byte[] image = imageRepository.downloadImage(testImageId);
        assertNotNull(image);
        assertArrayEquals(testImageData, image);
    }

    @Test
    public void testDownloadImages() throws Exception {
        List<byte[]> images = imageRepository.downloadImages(List.of(testImageId, testImageId));
        assertNotNull(images);
        assertEquals(2, images.size());
        assertArrayEquals(testImageData, images.get(0));
        assertArrayEquals(testImageData, images.get(1));
    }

    @Test
    public void testDownloadImageWithException() {
        doThrow(new RuntimeException("Download failed")).when(gridFSBucket)
                .downloadToStream(any(ObjectId.class), any(ByteArrayOutputStream.class));

        Exception exception = assertThrows(Exception.class, () -> imageRepository.downloadImage(testImageId));
        assertTrue(exception.getMessage().contains("Error retrieving image"));
    }
}