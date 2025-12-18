import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private productsClient: ClientProxy;

  constructor() {
    this.productsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3003 },
    });
  }

  async createProduct(data: any) {
    return lastValueFrom(this.productsClient.send({ cmd: 'create-product' }, data));
  }

  async getAllproducts() {
    return lastValueFrom(this.productsClient.send({ cmd: 'get-allproducts' }, {}));
  }

  async getProductById(id: string) {
    return lastValueFrom(this.productsClient.send({ cmd: 'get-product' }, id));
  }

  async updateProductById(id: string, data: any) {
    return lastValueFrom(this.productsClient.send(
      { cmd: 'update-product' },
      { id, data },
    ));
  }

  async DeleteProductById(id: string) {
    return lastValueFrom(this.productsClient.send({ cmd: 'delete-product' }, id));
  }
}
