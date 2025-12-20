/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { AuthModule } from './user/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { OrderModule } from './order/order.module';

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


    ProductModule,
    AuthModule,
    FeedbackModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

