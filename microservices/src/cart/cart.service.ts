import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  // Example: in-memory cart store for now
  private carts: Record<string, { productId: string; quantity: number }[]> = {};

  getCart(userId: string) {
    this.logger.log(`Fetching cart for user: ${userId}`);
    return this.carts[userId] || [];
  }

  addToCart(userId: string, productId: string, quantity: number) {
    if (!this.carts[userId]) {
      this.carts[userId] = [];
    }

    const item = this.carts[userId].find(i => i.productId === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      this.carts[userId].push({ productId, quantity });
    }

    this.logger.log(`Added product ${productId} (qty: ${quantity}) to cart for user: ${userId}`);
    return this.carts[userId];
  }

  removeFromCart(userId: string, productId: string) {
    if (!this.carts[userId]) return [];
    this.carts[userId] = this.carts[userId].filter(i => i.productId !== productId);
    this.logger.log(`Removed product ${productId} from cart for user: ${userId}`);
    return this.carts[userId];
  }

  clearCart(userId: string) {
    this.carts[userId] = [];
    this.logger.log(`Cleared cart for user: ${userId}`);
    return [];
  }
}
