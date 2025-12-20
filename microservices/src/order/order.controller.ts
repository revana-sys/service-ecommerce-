/* eslint-disable prettier/prettier */
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    private readonly logger = new Logger(OrderController.name);

    constructor(private readonly orderService: OrderService) { }

    // --- TCP Message Handlers (for API Gateway) ---

    /**
     * Create a new order
     */
    @MessagePattern({ cmd: 'create-order' })
    async createOrder(@Payload() data: any) {
        this.logger.log('TCP: Create Order');
        try {
            const order = await this.orderService.create(data);
            const orderObj = (order as any).toObject ? (order as any).toObject() : order;
            return {
                status: 'success',
                message: 'Order created successfully',
                data: orderObj,
            };
        } catch (error) {
            this.logger.error('Error creating order:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to create order',
            };
        }
    }

    /**
     * Get all orders (admin)
     */
    @MessagePattern({ cmd: 'get-all-orders' })
    async getAllOrders() {
        this.logger.log('TCP: Get All Orders');
        try {
            const orders = await this.orderService.findAll();
            return {
                count: orders.length,
                data: orders,
            };
        } catch (error) {
            this.logger.error('Error fetching orders:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to fetch orders',
            };
        }
    }

    /**
     * Get orders by customer email
     */
    @MessagePattern({ cmd: 'get-orders-by-customer' })
    async getOrdersByCustomer(@Payload() email: string) {
        this.logger.log(`TCP: Get Orders for Customer: ${email}`);
        try {
            const orders = await this.orderService.findByCustomerEmail(email);
            return {
                count: orders.length,
                orders: orders,
            };
        } catch (error) {
            this.logger.error('Error fetching customer orders:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to fetch customer orders',
            };
        }
    }

    /**
     * Get orders by customer user ID
     */
    @MessagePattern({ cmd: 'get-orders-by-customer-id' })
    async getOrdersByCustomerId(@Payload() userId: string) {
        this.logger.log(`TCP: Get Orders for Customer ID: ${userId}`);
        try {
            const orders = await this.orderService.findByCustomerId(userId);
            return {
                count: orders.length,
                orders: orders,
            };
        } catch (error) {
            this.logger.error('Error fetching customer orders:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to fetch customer orders',
            };
        }
    }

    /**
     * Get single order by ID
     */
    @MessagePattern({ cmd: 'get-order' })
    async getOrder(@Payload() id: string) {
        this.logger.log(`TCP: Get Order ${id}`);
        try {
            const order = await this.orderService.findOne(id);
            if (!order) {
                return {
                    status: 'error',
                    message: 'Order not found',
                };
            }
            return order;
        } catch (error) {
            this.logger.error('Error fetching order:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to fetch order',
            };
        }
    }

    /**
     * Update order status
     */
    @MessagePattern({ cmd: 'update-order-status' })
    async updateOrderStatus(@Payload() payload: { id: string; status: string }) {
        this.logger.log(`TCP: Update Order Status ${payload.id} to ${payload.status}`);
        try {
            const { id, status } = payload;
            const updatedOrder = await this.orderService.updateStatus(id, status);

            if (!updatedOrder) {
                return {
                    status: 'error',
                    message: 'Order not found',
                };
            }

            return {
                status: 'success',
                message: 'Order status updated successfully',
                data: updatedOrder,
            };
        } catch (error) {
            this.logger.error('Error updating order status:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to update order status',
            };
        }
    }

    /**
     * Delete an order
     */
    @MessagePattern({ cmd: 'delete-order' })
    async deleteOrder(@Payload() id: string) {
        this.logger.log(`TCP: Delete Order ${id}`);
        try {
            const result = await this.orderService.delete(id);

            if (result.deletedCount === 0) {
                return {
                    status: 'error',
                    message: 'Order not found',
                };
            }

            return {
                status: 'success',
                message: 'Order deleted successfully',
                deletedCount: result.deletedCount,
            };
        } catch (error) {
            this.logger.error('Error deleting order:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to delete order',
            };
        }
    }

    /**
     * Get order statistics
     */
    @MessagePattern({ cmd: 'get-order-stats' })
    async getOrderStats() {
        this.logger.log('TCP: Get Order Statistics');
        try {
            const stats = await this.orderService.getOrderStats();
            return {
                status: 'success',
                data: stats,
            };
        } catch (error) {
            this.logger.error('Error fetching order stats:', error.message);
            return {
                status: 'error',
                message: error.message || 'Failed to fetch order statistics',
            };
        }
    }
}
