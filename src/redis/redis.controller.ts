import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class RedisController {
  @MessagePattern('getHello')
  getHello(data: string): string {
    return `Hello ${data}`;
  }
  @MessagePattern('redis-micro')
  redisMicroserviceTest(data: string): string {
    return `Hello ${data} from redis microservice`;
  }
}
