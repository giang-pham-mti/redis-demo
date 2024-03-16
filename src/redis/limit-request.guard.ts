import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class LimitRequestGuard implements CanActivate {
  // eslint-disable-next-line prettier/prettier
  constructor(@Inject('REDIS_CLIENT') readonly redis : Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.ip;
    const current = await this.redis.get(key);
    if (current && parseInt(current) >= 5) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    await this.redis.incr(key);
    await this.redis.expire(key, 10);
    return true;
  }
}