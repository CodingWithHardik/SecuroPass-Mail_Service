import { Redis } from "ioredis";
import "dotenv/config";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  lazyConnect: false,
});

export const subscribe = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false,
  lazyConnect: false,
});

redis.on("connect", () => {
  console.log("Redis client connected");
});
subscribe.on("connect", () => {
  console.log("Subscribe client connected");
});

await import("./handler/index");
