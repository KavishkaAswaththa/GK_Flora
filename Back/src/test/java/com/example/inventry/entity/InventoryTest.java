package com.example.inventry.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Arrays;

public class InventoryTest {

    @Test
    public void testInventoryCreation() {
        List<String> imageIds = Arrays.asList("img1", "img2");
        Inventory inventory = new Inventory();
        inventory.set_id("1");
        inventory.setName("Test Bouquet");
        inventory.setCategory("Flowers");
        inventory.setDescription("Beautiful bouquet");
        inventory.setPrice(20.5);
        inventory.setBloomContains("Roses, Lilies");
        inventory.setImageIds(imageIds);

        assertEquals("1", inventory.get_id());
        assertEquals("Test Bouquet", inventory.getName());
        assertEquals("Flowers", inventory.getCategory());
        assertEquals("Beautiful bouquet", inventory.getDescription());
        assertEquals(20.5, inventory.getPrice());
        assertEquals("Roses, Lilies", inventory.getBloomContains());
        assertEquals(imageIds, inventory.getImageIds());
    }

    @Test
    public void testInventorySetterGetter() {
        Inventory inventory = new Inventory();
        inventory.set_id("2");
        inventory.setName("Sunflower Set");
        inventory.setCategory("Flowers");
        inventory.setDescription("Bright yellow sunflowers");
        inventory.setPrice(15.0);
        inventory.setBloomContains("Sunflowers");
        inventory.setImageIds(List.of("img3"));

        assertEquals("2", inventory.get_id());
        assertEquals("Sunflower Set", inventory.getName());
        assertEquals("Flowers", inventory.getCategory());
        assertEquals("Bright yellow sunflowers", inventory.getDescription());
        assertEquals(15.0, inventory.getPrice());
        assertEquals("Sunflowers", inventory.getBloomContains());
        assertEquals(List.of("img3"), inventory.getImageIds());
    }
}
