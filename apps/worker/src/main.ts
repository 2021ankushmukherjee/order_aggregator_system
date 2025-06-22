import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  await NestFactory.create(WorkerModule);
  console.log(`Order Worker started and ready to consume messages`)
}
bootstrap();
