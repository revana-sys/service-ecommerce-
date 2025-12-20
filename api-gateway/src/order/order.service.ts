/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
    private orderClient: ClientProxy;

    constructor() {
        this.orderClient = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: { host: '127.0.0.1', port: 3003 },
        });
    }

    /**
     * Create a new order
     */
    async createOrder(orderData: any) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'create-order' }, orderData),
        );
    }

    /**
     * Get all orders (admin)
     */
    async getAllOrders() {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'get-all-orders' }, {}),
        );
    }

    /**
     * Get orders by customer email
     */
    async getOrdersByCustomer(email: string) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'get-orders-by-customer' }, email),
        );
    }

    /**
     * Get orders by customer user ID
     */
    async getOrdersByCustomerId(userId: string) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'get-orders-by-customer-id' }, userId),
        );
    }

    /**
     * Get single order by ID
     */
    async getOrderById(id: string) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'get-order' }, id),
        );
    }

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: string) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'update-order-status' }, { id, status }),
        );
    }

    /**
     * Delete an order
     */
    async deleteOrder(id: string) {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'delete-order' }, id),
        );
    }

    /**
     * Get order statistics
     */
    async getOrderStats() {
        return lastValueFrom(
            this.orderClient.send({ cmd: 'get-order-stats' }, {}),
        );
    }
}
