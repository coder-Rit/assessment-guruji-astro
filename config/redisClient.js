

const redisClient = {
  host: process.env.REDIS_URI, // Replace with your Redis server hostname or IP
  port: process.env.REDIS_PORT, // Replace with your Redis server port if needed
}

export default redisClient;
