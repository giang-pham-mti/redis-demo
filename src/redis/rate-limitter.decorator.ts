import { Redis } from 'ioredis';

const redis = new Redis();
export function rateLimiter(maxCalls: number, duration: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `rate-limiter:${propertyKey}`;
      debugger;
      const current = await redis.get(key);
      if (current !== null && parseInt(current) >= maxCalls) {
        throw new Error("You've hit the rate limit");
      } else {
        await redis.multi().incr(key).expire(key, duration).exec();
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
