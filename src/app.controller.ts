import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { rateLimiter } from './redis/rate-limitter.decorator';
import { LimitRequestGuard } from './redis/limit-request.guard';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { ConsumerService } from './kafka/consumer.service';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @Inject('REDIS_SERVICE') private readonly redisService: ClientProxy,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
    private readonly appService: AppService,
    ) {}

    async onModuleInit(){
    this.kafkaService.subscribeToResponseOf('kafka-micro');
    await this.kafkaService.connect();
    this.consumerService.consume(
      { topics: ['kafka-topic'], fromBeginning: true},
    );
  }
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('decorator')
  @rateLimiter(5, 10)
  testRedisDecorator(){
    return 'Test redis decorator';
  }

  @Get('guard')
  @UseGuards(LimitRequestGuard)
  testRedisGuard(){
    return 'Test redis guard';
  }

  @Get('redis')
  testRedisMicroservice(){
    return this.redisService.send<string>('redis-micro', 'test');
  }

  @Get('kafka')
  testKafkaMicroservice(){
    return this.kafkaService.emit<string>('kafka-micro', 'test')
  }

  @Get('kafka-topic')
  testKafkaConsumer(){
    return this.producerService.produce({
      topic: 'kafka-topic',
      messages: [
        {
          value: 'Hello Kafka',
        },
      ],
    });
  }
}
