package com.example.inventry.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class MongoConfigTest {

    @Test
    void gridFSBucket_shouldBeCreated() {
        // Mock the MongoClient and MongoDatabase
        MongoClient mongoClient = Mockito.mock(MongoClient.class);
        MongoDatabase mockDatabase = Mockito.mock(MongoDatabase.class);

        when(mongoClient.getDatabase("GK_Flora_DB")).thenReturn(mockDatabase);

        // Instantiate the configuration class
        MongoConfig mongoConfig = new MongoConfig();
        GridFSBucket gridFSBucket = mongoConfig.gridFSBucket(mongoClient);

        // Verify the GridFSBucket bean is created
        assertNotNull(gridFSBucket, "GridFSBucket bean should not be null");
    }
}
