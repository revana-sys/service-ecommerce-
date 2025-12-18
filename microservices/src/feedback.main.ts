import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { FeedbackAppModule } from './feedback/feedback.app.module';

async function bootstrap() {
    const logger = new Logger('FeedbackService');
    try {
        // Create the Hybrid Application (HTTP + Microservice)
        const app = await NestFactory.create(FeedbackAppModule);

        // Enable CORS for Client
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });

        // Connect Microservice Strategy (TCP) - Feedback Service
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.TCP,
            options: {
                host: '127.0.0.1',
                port: 3005,
            },
        });

        await app.startAllMicroservices();

        // Listen on HTTP Port 4010
        const port = process.env.FEEDBACK_PORT || 4010;
        await app.listen(port);
        logger.log(`✅ Feedback Service (HTTP) is running on: http://localhost:${port}`);
        logger.log(`✅ Feedback Service (TCP) is running on port 3005`);

    } catch (error) {
        logger.error('❌ Feedback Service failed to start:', error.message);
        process.exit(1);
    }
}

bootstrap();