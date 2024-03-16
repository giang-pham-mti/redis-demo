import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const redisInstance = new Redis({
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      host: process.env.REDIS_HOST || 'localhost',
    });
    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection Failed: ${e}`);
    });
    return redisInstance;
  },
};
