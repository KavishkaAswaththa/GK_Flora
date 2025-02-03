package com.example.inventry.service;

import com.example.inventry.entity.Inventory;
import com.example.inventry.repo.InventoryRepo;
import com.example.inventry.repo.ImageRepository;
import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ImageServiceTest {

    @Mock
    private InventoryRepo inventoryRepo;

    @Mock
    private GridFSBucket gridFSBucket;

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @InjectMocks
    private ImageService imageService;

    @Test
    public void testSaveInventory() {
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");

        when(inventoryRepo.save(inventory)).thenReturn(inventory);

        inventoryService.save(inventory);
        verify(inventoryRepo, times(1)).save(inventory);
    }

    @Test
    public void testGetById() {
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Item");

        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));

        Inventory retrievedInventory = inventoryService.getById("1");
        assertNotNull(retrievedInventory);
        assertEquals("Test Item", retrievedInventory.getName());
    }

    @Test
    public void testGetAllInventories() {
        Inventory inventory1 = new Inventory();
        inventory1.set_id("1");
        inventory1.setName("Item 1");

        Inventory inventory2 = new Inventory();
        inventory2.set_id("2");
        inventory2.setName("Item 2");

        when(inventoryRepo.findAll()).thenReturn(List.of(inventory1, inventory2));

        List<Inventory> inventories = inventoryService.getAllInventories();
        assertEquals(2, inventories.size());
        assertEquals("Item 1", inventories.get(0).getName());
        assertEquals("Item 2", inventories.get(1).getName());
    }

    @Test
    public void testDeleteById() {
        when(inventoryRepo.existsById("1")).thenReturn(true);
        doNothing().when(inventoryRepo).deleteById("1");

        boolean deleted = inventoryService.deleteById("1");
        assertTrue(deleted);
        verify(inventoryRepo, times(1)).deleteById("1");
    }

    @Test
    public void testUploadImage() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(file.getOriginalFilename()).thenReturn("test.jpg");

        ObjectId objectId = new ObjectId();
        doReturn(objectId).when(gridFSBucket).openUploadStream("test.jpg");

        ObjectId uploadedId = imageService.uploadImage(file);
        assertNotNull(uploadedId);
    }

    @Test
    public void testGetImageIdsByInventoryId() {
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setImageIds(Arrays.asList("img1", "img2"));

        when(inventoryRepo.findById("1")).thenReturn(Optional.of(inventory));

        List<String> imageIds = imageService.getImageIdsByInventoryId("1");
        assertEquals(2, imageIds.size());
        assertEquals("img1", imageIds.get(0));
    }

    @Test
    public void testGetImageById() throws Exception {
        byte[] imageData = new byte[]{1, 2, 3};
        when(imageRepository.downloadImage("img1")).thenReturn(imageData);

        byte[] retrievedData = imageService.getImageById("img1");
        assertArrayEquals(imageData, retrievedData);
    }
}
