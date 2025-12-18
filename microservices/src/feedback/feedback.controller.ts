import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
    private readonly logger = new Logger(FeedbackController.name);

    constructor(private readonly feedbackService: FeedbackService) { }

    // HTTP Endpoints
    @Post()
    async createFeedback(@Body() feedbackData: any) {
        this.logger.log('📝 Creating new feedback via HTTP');
        return await this.feedbackService.createFeedback(feedbackData);
    }

    @Get()
    async getAllFeedback() {
        this.logger.log('📋 Retrieving all feedback via HTTP');
        return await this.feedbackService.getAllFeedback();
    }

    @Get(':id')
    async getFeedbackById(@Param('id') id: string) {
        this.logger.log(`🔍 Retrieving feedback by ID: ${id} via HTTP`);
        return await this.feedbackService.getFeedbackById(id);
    }

    @Get('user/:userId')
    async getFeedbackByUserId(@Param('userId') userId: string) {
        this.logger.log(`👤 Retrieving feedback for user: ${userId} via HTTP`);
        return await this.feedbackService.getFeedbackByUserId(userId);
    }

    @Get('product/:productId')
    async getFeedbackByProductId(@Param('productId') productId: string) {
        this.logger.log(`📦 Retrieving feedback for product: ${productId} via HTTP`);
        return await this.feedbackService.getFeedbackByProductId(productId);
    }

    @Put(':id')
    async updateFeedback(@Param('id') id: string, @Body() updateData: any) {
        this.logger.log(`✏️ Updating feedback with ID: ${id} via HTTP`);
        return await this.feedbackService.updateFeedback(id, updateData);
    }

    @Delete(':id')
    async deleteFeedback(@Param('id') id: string) {
        this.logger.log(`🗑️ Deleting feedback with ID: ${id} via HTTP`);
        await this.feedbackService.deleteFeedback(id);
        return { message: 'Feedback deleted successfully' };
    }

    // Microservice Message Patterns
    @MessagePattern('create_feedback')
    async handleCreateFeedback(data: any) {
        this.logger.log('📝 Creating new feedback via TCP');
        return await this.feedbackService.createFeedback(data);
    }

    @MessagePattern('get_all_feedback')
    async handleGetAllFeedback() {
        this.logger.log('📋 Retrieving all feedback via TCP');
        return await this.feedbackService.getAllFeedback();
    }

    @MessagePattern('get_feedback_by_id')
    async handleGetFeedbackById(data: { id: string }) {
        this.logger.log(`🔍 Retrieving feedback by ID: ${data.id} via TCP`);
        return await this.feedbackService.getFeedbackById(data.id);
    }

    @MessagePattern('get_feedback_by_user')
    async handleGetFeedbackByUserId(data: { userId: string }) {
        this.logger.log(`👤 Retrieving feedback for user: ${data.userId} via TCP`);
        return await this.feedbackService.getFeedbackByUserId(data.userId);
    }

    @MessagePattern('get_feedback_by_product')
    async handleGetFeedbackByProductId(data: { productId: string }) {
        this.logger.log(`📦 Retrieving feedback for product: ${data.productId} via TCP`);
        return await this.feedbackService.getFeedbackByProductId(data.productId);
    }

    @MessagePattern('update_feedback')
    async handleUpdateFeedback(data: { id: string; updateData: any }) {
        this.logger.log(`✏️ Updating feedback with ID: ${data.id} via TCP`);
        return await this.feedbackService.updateFeedback(data.id, data.updateData);
    }

    @MessagePattern('delete_feedback')
    async handleDeleteFeedback(data: { id: string }) {
        this.logger.log(`🗑️ Deleting feedback with ID: ${data.id} via TCP`);
        await this.feedbackService.deleteFeedback(data.id);
        return { message: 'Feedback deleted successfully' };
    }
}