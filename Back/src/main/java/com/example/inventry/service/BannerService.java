package com.example.inventry.service;

import com.example.inventry.entity.Banner;

import java.util.List;

public abstract class BannerService {
    public abstract Banner createItem(Banner item);

    public abstract List<Banner> getAllItems();

    public abstract Banner getItemById(String id);

    public abstract Banner updateItem(String id, Banner updatedItem);

    public abstract void deleteItem(String id);

    public interface InventoryService {
        Banner createItem(Banner item);
        List<Banner> getAllItems();
        Banner getItemById(String id);
        Banner updateItem(String id, Banner updatedItem);
        void deleteItem(String id);
    }
}
