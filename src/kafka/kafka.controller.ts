import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  @EventPattern('kafka-micro')
  kafkaTest(data: string): string {
    return `Kafka test with ${data}`;
  }
  @MessagePattern('kafka-topic')
  kafkaTopicTest(data: string): string {
    return `Kafka topic test with ${data}`;
  }
}
