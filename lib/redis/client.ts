import { Redis } from "@upstash/redis";

const REQUIRED_ENV_VARS = [
  "KV_URL",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "KV_REST_API_READ_ONLY_TOKEN",
  "REDIS_URL",
];

for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required`);
  }
}

const redis = Redis.fromEnv();

export default redis;
