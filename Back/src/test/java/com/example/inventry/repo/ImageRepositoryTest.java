package com.example.inventry.repo;

import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ImageRepositoryTest {

    private ImageRepository imageRepository;
    private GridFSBucket gridFSBucket;

    @BeforeEach
    void setUp() {
        // Mock the GridFSBucket dependency
        gridFSBucket = Mockito.mock(GridFSBucket.class);

        // Create an instance of ImageRepository and inject the mocked GridFSBucket
        imageRepository = new ImageRepository();
        imageRepository.gridFSBucket = gridFSBucket;
    }

    @Test
    void testDownloadImageSuccess() throws Exception {
        // Mock ObjectId and expected output
        String imageId = "64f3456a81bca76d7c8f1234";
        byte[] expectedImageData = "test image data".getBytes();

        // Simulate GridFSBucket behavior
        doAnswer(invocation -> {
            ObjectId id = invocation.getArgument(0);
            ByteArrayOutputStream outputStream = invocation.getArgument(1);
            assertEquals(new ObjectId(imageId), id); // Validate ObjectId passed
            outputStream.write(expectedImageData); // Write mock data to the stream
            return null;
        }).when(gridFSBucket).downloadToStream(eq(new ObjectId(imageId)), any(ByteArrayOutputStream.class));

        // Test the method
        byte[] actualImageData = imageRepository.downloadImage(imageId);

        // Verify the result
        assertArrayEquals(expectedImageData, actualImageData);
    }

    @Test
    void testDownloadImageThrowsException() {
        // Mock ObjectId
        String imageId = "64f3456a81bca76d7c8f1234";

        // Simulate GridFSBucket throwing an exception
        doThrow(new RuntimeException("GridFS error")).when(gridFSBucket).downloadToStream(any(ObjectId.class), any(ByteArrayOutputStream.class));

        // Test the method
        Exception exception = assertThrows(Exception.class, () -> imageRepository.downloadImage(imageId));

        // Verify the exception message
        assertEquals("Error retrieving image", exception.getMessage());
        assertNotNull(exception.getCause());
        assertTrue(exception.getCause() instanceof RuntimeException);
        assertEquals("GridFS error", exception.getCause().getMessage());
    }
}
