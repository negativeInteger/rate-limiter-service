import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis Error:", err));
redis.on("ready", () => console.log("Connected to Redis!!!"));

redis.connect(); 

export { redis };
