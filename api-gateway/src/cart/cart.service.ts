import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(@Inject('CART_SERVICE') private readonly client: ClientProxy) {}

  async getCart(userId: string): Promise<any> {
    this.logger.log(`Fetching cart for user: ${userId}`);
    // Microservice expects a string
    return lastValueFrom(this.client.send({ cmd: 'get-cart' }, userId));
  }

  async addToCart(userId: string, item: { productId: string; quantity: number }): Promise<any> {
    this.logger.log(`Adding item to cart for user: ${userId}`);
    // Microservice expects { userId, productId, quantity }
    return lastValueFrom(
      this.client.send(
        { cmd: 'add-to-cart' },
        { userId, productId: item.productId, quantity: item.quantity },
      ),
    );
  }

  async removeFromCart(userId: string, productId: string): Promise<any> {
    this.logger.log(`Removing item ${productId} from cart for user: ${userId}`);
    return lastValueFrom(
      this.client.send({ cmd: 'remove-from-cart' }, { userId, productId }),
    );
  }

  async clearCart(userId: string): Promise<any> {
    this.logger.log(`Clearing cart for user: ${userId}`);
    return lastValueFrom(this.client.send({ cmd: 'clear-cart' }, userId));
  }
}
