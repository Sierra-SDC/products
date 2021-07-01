const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_URL}`,
});

redisClient.on('error', (error) => {
  console.error(error);
});

module.exports = redisClient;
