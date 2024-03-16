import {  Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';


@Injectable()
export class AppService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly producerService: ProducerService,
    ) {}
  async getHello() {
    await this.producerService.produce({
      topic: 'test',
      messages: [
        {
          value: 'Hello world',
        },
      ],
    });
    return 'Hello World!';
  }
}
