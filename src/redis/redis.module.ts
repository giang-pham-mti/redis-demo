import { Module } from '@nestjs/common';
import { RedisClientFactory } from './redis-client-factory';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';
@Module({
  providers: [RedisClientFactory, RedisService],
  exports: [RedisClientFactory],
  controllers: [RedisController],
})
export class RedisModule {}
