package com.example.inventry.serviceImpl;

import com.example.inventry.entity.Banner;
import com.example.inventry.service.BannerService;
import com.example.inventry.repo.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public class BannerServiceImpl {

    @Service
    public class InventoryServiceImpl extends BannerService {

        private final BannerRepository inventoryRepository;

        public InventoryServiceImpl(BannerRepository inventoryRepository) {
            this.inventoryRepository = inventoryRepository;
        }

        @Override
        public Banner createItem(Banner item) {
            return inventoryRepository.save(item);
        }

        @Override
        public List<Banner> getAllItems() {
            return inventoryRepository.findAll();
        }

        @Override
        public Banner getItemById(String id) {
            return inventoryRepository.findById(id).orElse(null);
        }

        @Override
        public Banner updateItem(String id, Banner updatedItem) {
            Optional<Banner> optional = inventoryRepository.findById(id);
            if (optional.isPresent()) {
                Banner item = optional.get();
                item.setName(updatedItem.getName());
                item.setDescription(updatedItem.getDescription());
                item.setPrice(updatedItem.getPrice());
                item.setImageUrl(updatedItem.getImageUrl());
                item.setAvailable(updatedItem.isAvailable());
                return inventoryRepository.save(item);
            }
            return null;
        }

        @Override
        public void deleteItem(String id) {
            inventoryRepository.deleteById(id);
        }
    }
}
