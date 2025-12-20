/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.model';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectModel('Order') private readonly orderModel: Model<Order>,
    ) { }

    /**
     * Create a new order
     */
    async create(orderData: any): Promise<Order> {
        this.logger.log('Creating new order');
        try {
            const newOrder = new this.orderModel(orderData);
            const savedOrder = await newOrder.save();
            this.logger.log(`Order created successfully with ID: ${savedOrder._id}`);
            return savedOrder;
        } catch (error) {
            this.logger.error(`Error creating order: ${error.message}`);
            throw error;
        }
    }

    /**
     * Find all orders (admin functionality)
     */
    async findAll(): Promise<Order[]> {
        this.logger.log('Fetching all orders');
        return await this.orderModel.find().sort({ createdAt: -1 }).exec();
    }

    /**
     * Find orders by customer email
     */
    async findByCustomerEmail(email: string): Promise<Order[]> {
        this.logger.log(`Fetching orders for customer: ${email}`);
        return await this.orderModel
            .find({ 'customerInfo.email': email.toLowerCase() })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find orders by customer user ID
     */
    async findByCustomerId(userId: string): Promise<Order[]> {
        this.logger.log(`Fetching orders for customer ID: ${userId}`);
        return await this.orderModel
            .find({ 'customerInfo.userId': userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find a single order by ID
     */
    async findOne(id: string): Promise<Order | null> {
        this.logger.log(`Fetching order by ID: ${id}`);
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            this.logger.warn(`Order not found with ID: ${id}`);
            return null;
        }
        return order;
    }

    /**
     * Update order status
     */
    async updateStatus(id: string, status: string): Promise<Order | null> {
        this.logger.log(`Updating order ${id} status to: ${status}`);
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
        }

        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();

        if (!updatedOrder) {
            this.logger.warn(`Order not found for status update: ${id}`);
            return null;
        }

        this.logger.log(`Order ${id} status updated to: ${status}`);
        return updatedOrder;
    }

    /**
     * Update order details
     */
    async update(id: string, updateData: Partial<Order>): Promise<Order | null> {
        this.logger.log(`Updating order: ${id}`);
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        if (!updatedOrder) {
            this.logger.warn(`Order not found for update: ${id}`);
            return null;
        }

        return updatedOrder;
    }

    /**
     * Delete an order
     */
    async delete(id: string): Promise<{ deletedCount: number }> {
        this.logger.log(`Deleting order: ${id}`);
        const result = await this.orderModel.deleteOne({ _id: id }).exec();

        if (result.deletedCount === 0) {
            this.logger.warn(`Order not found for deletion: ${id}`);
        } else {
            this.logger.log(`Order ${id} deleted successfully`);
        }

        return { deletedCount: result.deletedCount };
    }

    /**
     * Get order statistics (for admin dashboard)
     */
    async getOrderStats(): Promise<{
        total: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        totalRevenue: number;
    }> {
        this.logger.log('Fetching order statistics');

        const orders = await this.orderModel.find().exec();

        const stats = {
            total: orders.length,
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
            totalRevenue: 0,
        };

        orders.forEach((order) => {
            stats[order.status as keyof typeof stats]++;
            if (order.status !== 'cancelled') {
                stats.totalRevenue += order.totalAmount;
            }
        });

        return stats;
    }
}
