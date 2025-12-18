import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'FEEDBACK_SERVICE',
                transport: Transport.TCP,
                options: { host: '127.0.0.1', port: 3005 },
            },
            {
                name: 'USER_SERVICE',
                transport: Transport.TCP,
                options: { host: '127.0.0.1', port: 3004 }, // Assuming user service runs on port 3004
            },
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.TCP,
                options: { host: '127.0.0.1', port: 3003 }, // Assuming product service runs on port 3003
            },
        ]),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule { }