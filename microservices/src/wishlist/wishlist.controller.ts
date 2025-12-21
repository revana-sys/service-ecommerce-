import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WishlistService } from './wishlist.service';

@Controller()
export class WishlistController {
    private readonly logger = new Logger(WishlistController.name);

    constructor(private readonly wishlistService: WishlistService) { }

    @MessagePattern({ cmd: 'get-wishlist' })
    async getWishlist(userId: string) {
        this.logger.log(`Fetching wishlist for user: ${userId}`);
        return this.wishlistService.getWishlist(userId);
    }

    @MessagePattern({ cmd: 'add-to-wishlist' })
    async addToWishlist(data: { userId: string; productId: string }) {
        this.logger.log(`Adding product ${data.productId} to wishlist for user: ${data.userId}`);
        return this.wishlistService.addToWishlist(data.userId, data.productId);
    }

    @MessagePattern({ cmd: 'remove-from-wishlist' })
    async removeFromWishlist(data: { userId: string; productId: string }) {
        this.logger.log(`Removing product ${data.productId} from wishlist for user: ${data.userId}`);
        return this.wishlistService.removeFromWishlist(data.userId, data.productId);
    }

    @MessagePattern({ cmd: 'clear-wishlist' })
    async clearWishlist(userId: string) {
        this.logger.log(`Clearing wishlist for user: ${userId}`);
        return this.wishlistService.clearWishlist(userId);
    }

    @MessagePattern({ cmd: 'is-in-wishlist' })
    async isInWishlist(data: { userId: string; productId: string }) {
        this.logger.log(`Checking if product ${data.productId} is in wishlist for user: ${data.userId}`);
        return this.wishlistService.isInWishlist(data.userId, data.productId);
    }
}
