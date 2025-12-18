import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    // Create the Hybrid Application (HTTP + Microservice)
    const app = await NestFactory.create(AppModule);

    // Enable CORS for Client (running on 5173/5174)
    app.enableCors({
      origin: true, // Allow all origins or specify ['http://localhost:5173', 'http://localhost:5174']
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Serve static files from 'uploads' directory
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    // Connect Microservice Strategy (TCP)
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3003,
      },
    });

    await app.startAllMicroservices();

    // Listen on HTTP Port 4008
    const port = process.env.PORT || 4008;
    await app.listen(port);
    logger.log(`✅ Microservice (HTTP) is running on: http://localhost:${port}`);
    logger.log(`✅ Microservice (TCP) is running on port 3003`);

  } catch (error) {
    logger.error('❌ Microservice failed to start:', error.message);
    process.exit(1);
  }
}

bootstrap();
