import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import requestIp from "request-ip"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: redis,
  //   limiter: Ratelimit.slidingWindow(1, "10 s"),
  limiter: Ratelimit.fixedWindow(1, "10 s"),
  analytics: true,
})
