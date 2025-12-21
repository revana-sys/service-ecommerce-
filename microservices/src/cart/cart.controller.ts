import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'get-cart' })
  async getCart(userId: string) {
    this.logger.log(`Fetching cart for user: ${userId}`);
    return this.cartService.getCart(userId);
  }

  @MessagePattern({ cmd: 'add-to-cart' })
  async addToCart(data: { userId: string; productId: string; quantity: number }) {
    return this.cartService.addToCart(data.userId, data.productId, data.quantity);
  }

  @MessagePattern({ cmd: 'remove-from-cart' })
  async removeFromCart(data: { userId: string; productId: string }) {
    return this.cartService.removeFromCart(data.userId, data.productId);
  }

  @MessagePattern({ cmd: 'clear-cart' })
  async clearCart(userId: string) {
    return this.cartService.clearCart(userId);
  }
}
