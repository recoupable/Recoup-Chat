import redis from "./client";

const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const value = (await redis.get(key)) as T | null;
    return value;
  } catch (error) {
    console.error("Redis getCache error:", error);
    return null;
  }
};

export default getCache; 