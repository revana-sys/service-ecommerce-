import { Controller, Get, Post, Delete, Body, Param, Logger } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('api/wishlist')
export class WishlistController {
    private readonly logger = new Logger(WishlistController.name);

    constructor(private readonly wishlistService: WishlistService) { }

    @Get(':userId')
    async getWishlist(@Param('userId') userId: string) {
        this.logger.log(`API: Get wishlist for user ${userId}`);
        return this.wishlistService.getWishlist(userId);
    }

    @Post('add')
    async addToWishlist(@Body() body: { userId: string; productId: string }) {
        this.logger.log(`API: Add product ${body.productId} to wishlist for user ${body.userId}`);
        return this.wishlistService.addToWishlist(body.userId, body.productId);
    }

    @Delete('remove')
    async removeFromWishlist(@Body() body: { userId: string; productId: string }) {
        this.logger.log(`API: Remove product ${body.productId} from wishlist for user ${body.userId}`);
        return this.wishlistService.removeFromWishlist(body.userId, body.productId);
    }

    @Delete('clear/:userId')
    async clearWishlist(@Param('userId') userId: string) {
        this.logger.log(`API: Clear wishlist for user ${userId}`);
        return this.wishlistService.clearWishlist(userId);
    }

    @Get('check/:userId/:productId')
    async isInWishlist(@Param('userId') userId: string, @Param('productId') productId: string) {
        this.logger.log(`API: Check if product ${productId} is in wishlist for user ${userId}`);
        return this.wishlistService.isInWishlist(userId, productId);
    }
}
