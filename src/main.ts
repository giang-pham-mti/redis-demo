import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      name: 'REDIS_SERVICE',
      port: 6379,
      host: 'localhost',
      retryAttempts: 2,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'nestjs-kafka',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3009);
}
bootstrap();
