import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WishlistService {
    private readonly logger = new Logger(WishlistService.name);

    // In-memory wishlist store: userId -> array of productIds
    private wishlists: Record<string, string[]> = {};

    getWishlist(userId: string) {
        this.logger.log(`Fetching wishlist for user: ${userId}`);
        return this.wishlists[userId] || [];
    }

    addToWishlist(userId: string, productId: string) {
        if (!this.wishlists[userId]) {
            this.wishlists[userId] = [];
        }

        // Check if product is already in wishlist
        if (!this.wishlists[userId].includes(productId)) {
            this.wishlists[userId].push(productId);
            this.logger.log(`Added product ${productId} to wishlist for user: ${userId}`);
        } else {
            this.logger.log(`Product ${productId} already in wishlist for user: ${userId}`);
        }

        return this.wishlists[userId];
    }

    removeFromWishlist(userId: string, productId: string) {
        if (!this.wishlists[userId]) return [];

        this.wishlists[userId] = this.wishlists[userId].filter(id => id !== productId);
        this.logger.log(`Removed product ${productId} from wishlist for user: ${userId}`);
        return this.wishlists[userId];
    }

    clearWishlist(userId: string) {
        this.wishlists[userId] = [];
        this.logger.log(`Cleared wishlist for user: ${userId}`);
        return [];
    }

    isInWishlist(userId: string, productId: string) {
        if (!this.wishlists[userId]) return false;
        return this.wishlists[userId].includes(productId);
    }
}
