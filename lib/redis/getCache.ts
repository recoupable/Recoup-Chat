import redis from "./client";

const getCache = async (key: string): Promise<string | null> => {
  try {
    const value = await redis.get(key) as string | null;
    return value;
  } catch (error) {
    console.error("Redis getCache error:", error);
    return null;
  }
};

export default getCache; 