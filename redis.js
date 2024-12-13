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

// Export the Redis client and connection functions
module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
};
