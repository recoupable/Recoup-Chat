import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error("UPSTASH_REDIS_URL environment variable is required");
}

if (!process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error("UPSTASH_REDIS_TOKEN environment variable is required");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

export default redis; 