import { Controller, Get, Post, Put, Delete, Body, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
    private readonly logger = new Logger(FeedbackController.name);

    constructor(private readonly feedbackService: FeedbackService) { }

    @Post()
    async createFeedback(@Body() feedbackData: any) {
        try {
            this.logger.log('📝 API Gateway: Creating new feedback');
            return await this.feedbackService.createFeedback(feedbackData);
        } catch (error) {
            this.logger.error('❌ API Gateway: Error creating feedback:', error.message);
            throw new HttpException(
                error.message || 'Failed to create feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get()
    async getAllFeedback() {
        try {
            this.logger.log('📋 API Gateway: Retrieving all feedback');
            return await this.feedbackService.getAllFeedback();
        } catch (error) {
            this.logger.error('❌ API Gateway: Error retrieving feedback:', error.message);
            throw new HttpException(
                error.message || 'Failed to retrieve feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id')
    async getFeedbackById(@Param('id') id: string) {
        try {
            this.logger.log(`🔍 API Gateway: Retrieving feedback by ID: ${id}`);
            return await this.feedbackService.getFeedbackById(id);
        } catch (error) {
            this.logger.error(`❌ API Gateway: Error retrieving feedback with ID ${id}:`, error.message);
            throw new HttpException(
                error.message || 'Failed to retrieve feedback',
                HttpStatus.NOT_FOUND
            );
        }
    }

    @Get('user/:userId')
    async getFeedbackByUserId(@Param('userId') userId: string) {
        try {
            this.logger.log(`👤 API Gateway: Retrieving feedback for user: ${userId}`);
            return await this.feedbackService.getFeedbackByUserId(userId);
        } catch (error) {
            this.logger.error(`❌ API Gateway: Error retrieving feedback for user ${userId}:`, error.message);
            throw new HttpException(
                error.message || 'Failed to retrieve user feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('product/:productId')
    async getFeedbackByProductId(@Param('productId') productId: string) {
        try {
            this.logger.log(`📦 API Gateway: Retrieving feedback for product: ${productId}`);
            return await this.feedbackService.getFeedbackByProductId(productId);
        } catch (error) {
            this.logger.error(`❌ API Gateway: Error retrieving feedback for product ${productId}:`, error.message);
            throw new HttpException(
                error.message || 'Failed to retrieve product feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put(':id')
    async updateFeedback(@Param('id') id: string, @Body() updateData: any) {
        try {
            this.logger.log(`✏️ API Gateway: Updating feedback with ID: ${id}`);
            return await this.feedbackService.updateFeedback(id, updateData);
        } catch (error) {
            this.logger.error(`❌ API Gateway: Error updating feedback with ID ${id}:`, error.message);
            throw new HttpException(
                error.message || 'Failed to update feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(':id')
    async deleteFeedback(@Param('id') id: string) {
        try {
            this.logger.log(`🗑️ API Gateway: Deleting feedback with ID: ${id}`);
            return await this.feedbackService.deleteFeedback(id);
        } catch (error) {
            this.logger.error(`❌ API Gateway: Error deleting feedback with ID ${id}:`, error.message);
            throw new HttpException(
                error.message || 'Failed to delete feedback',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}