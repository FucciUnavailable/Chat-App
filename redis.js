'use strict';
require('dotenv').config();
const redis = require('redis');

// Create a Redis client and connect
const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // Ensure this environment variable is correctly set
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis error:', err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
}

async function disconnectRedis() {
  try {
    await redisClient.disconnect();
    console.log('Redis client disconnected');
  } catch (err) {
    console.error('Error disconnecting from Redis:', err);
  }
}

// Get messages from Redis cache using scan to avoid blocking operations
async function getMessagesFromCache() {
  try {
    // Ensure Redis client is connected before proceeding
    if (!redisClient.isOpen) {
      console.error('Redis client is not open!');
      await connectRedis(); // Reconnect if it's not open
    }

    let messages = [];
    let cursor = '0'; // Start cursor for SCAN

    do {
      // Scan for keys matching the pattern "message:*"
      const result = await redisClient.scan(cursor, {
        MATCH: 'message:*', // Use a pattern to match relevant keys
        COUNT: 100, // Number of keys to fetch per iteration
      });

      // Check if result is an object with cursor and keys properties
      if (result && result.cursor !== undefined && Array.isArray(result.keys)) {
        cursor = result.cursor; // Update cursor for the next iteration
        const keys = result.keys; // Access the keys array

        // Retrieve all messages stored in Redis
        for (const key of keys) {
          const message = await redisClient.get(key);
          if (message) {
            messages.push(message); // Add the message to the list
          }
        }
      } else {
        console.error('Unexpected result format:', result);
        break;
      }

    } while (cursor !== '0'); // Keep scanning until the cursor is 0 (no more keys)

    return messages;
  } catch (err) {
    console.error('Error retrieving messages from Redis:', err);
    return [];
  }
}


// Export the Redis client and connection functions
module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
  getMessagesFromCache,
};
