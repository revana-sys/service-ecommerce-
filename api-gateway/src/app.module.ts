import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    AuthModule,
    FeedbackModule,
    ClientsModule.register([
      {
        name: 'MICROSERVICES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
