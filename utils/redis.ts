import { redis } from "..";


const redisClient = redis.duplicate();

export const redis_get = async (key: string) => {
    return await redis.get(key);
};

export const redis_set = async (key: string, value: string) => {
    await redis.set(key, value);
};

export const redis_exists = async (key: string) => {
    return await redis.exists(key);
};

export const redis_del = async (key: string) => {
    await redis.del(key);
};

export const redis_keys = async (pattern: string) => {
    return await redis.keys(pattern);
};

export const redis_lpush = async (key: string, value: string) => {
    await redis.lpush(key, value);
};

export const redis_llen = async (key: string) => {
    return await redis.llen(key);
};

export const redis_zadd = async (key: string, expTime: number, current: string) => {
    await redis.zadd(key, expTime, current);
};

export const redis_brpop = async (key: string, timeout: number) => {
    return await redisClient.brpop(key, timeout);
};

export const redis_zrange = async (key: string, start: number, stop: number, withScores: boolean) => {
    return withScores ?
        await redis.zrange(key, start, stop, "WITHSCORES") :
        await redis.zrange(key, start, stop);
};

export const redis_zcard = async (key: string) => {
    return await redis.zcard(key);
};

export const redis_zremrangebyscore = async (key: string, min: number, max: number) => {
    await redis.zremrangebyscore(key, min, max);
};