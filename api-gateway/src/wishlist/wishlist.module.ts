import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'WISHLIST_SERVICE',
                transport: Transport.TCP,
                options: { host: '127.0.0.1', port: 3003 },
            },
        ]),
    ],
    controllers: [WishlistController],
    providers: [WishlistService],
})
export class WishlistModule { }
