package com.example.inventry.entity;

import java.util.List;

public class Bouquet {
    private List<List<Flower>> grid;

    public Bouquet(List<List<Flower>> grid) {
        this.grid = grid;
    }

    public List<List<Flower>> getGrid() {
        return grid;
    }
}