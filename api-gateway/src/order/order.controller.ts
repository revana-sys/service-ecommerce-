/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Res,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import type { Response } from 'express';

@Controller()
export class OrderController {
    private readonly logger = new Logger(OrderController.name);

    constructor(private readonly orderService: OrderService) { }

    /**
     * Create a new order
     * POST /api/orders/create - matches frontend checkout.jsx
     */
    @Post('api/orders/create')
    async createOrder(@Body() body: any, @Res() res: Response) {
        this.logger.log('Creating new order');
        try {
            const result = await this.orderService.createOrder(body);

            if (result?.status === 'error') {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }

            return res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            this.logger.error('Error creating order:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to create order',
            });
        }
    }

    /**
     * Get all orders (admin)
     * GET /orders
     */
    @Get('orders')
    async getAllOrders(@Res() res: Response) {
        this.logger.log('Fetching all orders');
        try {
            const result = await this.orderService.getAllOrders();
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error fetching orders:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to fetch orders',
            });
        }
    }

    /**
     * Get orders by customer email
     * GET /orders/customer/:email - matches frontend myorders.jsx
     */
    @Get('orders/customer/:email')
    async getOrdersByCustomer(
        @Param('email') email: string,
        @Res() res: Response,
    ) {
        this.logger.log(`Fetching orders for customer: ${email}`);
        try {
            const result = await this.orderService.getOrdersByCustomer(email);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error fetching customer orders:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to fetch customer orders',
            });
        }
    }

    /**
     * Get orders by customer user ID
     * GET /orders/user/:userId
     */
    @Get('orders/user/:userId')
    async getOrdersByCustomerId(
        @Param('userId') userId: string,
        @Res() res: Response,
    ) {
        this.logger.log(`Fetching orders for customer ID: ${userId}`);
        try {
            const result = await this.orderService.getOrdersByCustomerId(userId);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error fetching customer orders:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to fetch customer orders',
            });
        }
    }

    /**
     * Get single order by ID
     * GET /orders/:id
     */
    @Get('orders/:id')
    async getOrderById(@Param('id') id: string, @Res() res: Response) {
        this.logger.log(`Fetching order: ${id}`);
        try {
            // Validate MongoDB ObjectId format
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Invalid order ID format',
                });
            }

            const result = await this.orderService.getOrderById(id);

            if (result?.status === 'error') {
                return res.status(HttpStatus.NOT_FOUND).json(result);
            }

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error fetching order:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to fetch order',
            });
        }
    }

    /**
     * Update order status (admin)
     * PUT /orders/:id/status
     */
    @Put('orders/:id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Res() res: Response,
    ) {
        this.logger.log(`Updating order ${id} status to: ${status}`);
        try {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Invalid order ID format',
                });
            }

            if (!status) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Status is required',
                });
            }

            const result = await this.orderService.updateOrderStatus(id, status);

            if (result?.status === 'error') {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error updating order status:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to update order status',
            });
        }
    }

    /**
     * Delete an order
     * DELETE /orders/:id
     */
    @Delete('orders/:id')
    async deleteOrder(@Param('id') id: string, @Res() res: Response) {
        this.logger.log(`Deleting order: ${id}`);
        try {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Invalid order ID format',
                });
            }

            const result = await this.orderService.deleteOrder(id);

            if (result?.status === 'error') {
                return res.status(HttpStatus.NOT_FOUND).json(result);
            }

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error deleting order:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to delete order',
            });
        }
    }

    /**
     * Get order statistics (admin dashboard)
     * GET /orders/stats
     */
    @Get('api/orders/stats')
    async getOrderStats(@Res() res: Response) {
        this.logger.log('Fetching order statistics');
        try {
            const result = await this.orderService.getOrderStats();
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.logger.error('Error fetching order stats:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: error.message || 'Failed to fetch order statistics',
            });
        }
    }
}
