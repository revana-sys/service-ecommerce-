import { Controller, Get, Post, Delete, Body, Param, Logger } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    this.logger.log(`API: Get cart for user ${userId}`);
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(@Body() body: { userId: string; item: { productId: string; quantity: number } }) {
    this.logger.log(`API: Add item to cart for user ${body.userId}`);
    return this.cartService.addToCart(body.userId, body.item);
  }

  @Delete('remove')
  async removeFromCart(@Body() body: { userId: string; productId: string }) {
    this.logger.log(`API: Remove item ${body.productId} from cart for user ${body.userId}`);
    return this.cartService.removeFromCart(body.userId, body.productId);
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    this.logger.log(`API: Clear cart for user ${userId}`);
    return this.cartService.clearCart(userId);
  }
}
