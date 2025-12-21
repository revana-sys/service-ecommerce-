import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WishlistService {
    private readonly logger = new Logger(WishlistService.name);

    constructor(@Inject('WISHLIST_SERVICE') private readonly client: ClientProxy) { }

    async getWishlist(userId: string): Promise<any> {
        this.logger.log(`Fetching wishlist for user: ${userId}`);
        return lastValueFrom(this.client.send({ cmd: 'get-wishlist' }, userId));
    }

    async addToWishlist(userId: string, productId: string): Promise<any> {
        this.logger.log(`Adding product ${productId} to wishlist for user: ${userId}`);
        return lastValueFrom(
            this.client.send({ cmd: 'add-to-wishlist' }, { userId, productId }),
        );
    }

    async removeFromWishlist(userId: string, productId: string): Promise<any> {
        this.logger.log(`Removing product ${productId} from wishlist for user: ${userId}`);
        return lastValueFrom(
            this.client.send({ cmd: 'remove-from-wishlist' }, { userId, productId }),
        );
    }

    async clearWishlist(userId: string): Promise<any> {
        this.logger.log(`Clearing wishlist for user: ${userId}`);
        return lastValueFrom(this.client.send({ cmd: 'clear-wishlist' }, userId));
    }

    async isInWishlist(userId: string, productId: string): Promise<any> {
        this.logger.log(`Checking if product ${productId} is in wishlist for user: ${userId}`);
        return lastValueFrom(
            this.client.send({ cmd: 'is-in-wishlist' }, { userId, productId }),
        );
    }
}
