import { Redis } from "ioredis";
import "dotenv/config";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: true,
  lazyConnect: false,
});

export const subscribe = redis.duplicate();

redis.on("ready", () => {
  console.log("Redis client connected");
});

redis.on("error", (err) => {
  console.error("Redis client error:", err);
});

redis.on("reconnecting", () => {
  console.log("Redis client reconnecting");
})

await import("./handler/index");
