

const redisClient = {
  host: process.env.REDIS_URI, // Replace with your Redis server hostname or IP
  port: process.env.REDIS_PORT, // Replace with your Redis server port if needed
  username: process.env.REDIS_USER,  // Redis username (if required, for Redis 6+)
  password: process.env.REDIS_PASSWORD,  // Redis password
}

export default redisClient;
