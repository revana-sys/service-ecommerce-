import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeedbackModule } from './feedback.module';

@Module({
    imports: [
        // Load environment variables globally
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),

        // Connect to MongoDB dynamically using ConfigService
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('DB'),
            }),
        }),

        FeedbackModule,
    ],
    controllers: [],
    providers: [],
})
export class FeedbackAppModule { }