import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { WorkerService } from './worker.service';

async function bootstrap() {
   const app = await NestFactory.createApplicationContext(WorkerModule);


  app.get(WorkerService);

  console.log('Order Worker started and ready to consume messages');
}
bootstrap();
