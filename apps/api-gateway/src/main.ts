/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiGatewayModule, {
    snapshot: true,
  });

  const globalPreset = process.env.GLOBAL_PRESET || '';

  app.use(express.json({ limit: '50mb' }));
  app.setGlobalPrefix(globalPreset);

  app.enableCors({
    origin: '*', // Replace with specific origins in production
  });

  // Swagger setup (conditionally enabled)
  if (process.env.SWAGGER_ENABLED?.toLowerCase() === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Order Aggregator System')
      .setDescription('REST APIs for order placement and stock sync')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPreset}/swagger`, app, document);
  }

  const port = parseInt(process.env.NODE_PORT || '3000', 10);
  await app.listen(port, () => console.log(`API Gateway is listening on port ${port}`));
}

bootstrap();
