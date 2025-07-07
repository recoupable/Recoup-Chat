import redis from "./client";

const MAX_CACHE_TTL = 60 * 60 * 24 * 30; // 30 days

const setCache = async (key: string, value: string, ttl: number = MAX_CACHE_TTL) => {
  await redis.set(key, value, { ex: ttl });
};

export default setCache;
