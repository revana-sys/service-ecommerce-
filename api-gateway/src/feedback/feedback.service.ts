import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FeedbackService {
    private readonly logger = new Logger(FeedbackService.name);

    constructor(
        @Inject('FEEDBACK_SERVICE') private readonly feedbackClient: ClientProxy,
    ) { }

    async createFeedback(feedbackData: any) {
        try {
            this.logger.log('📝 Creating feedback via gateway');
            return await lastValueFrom(
                this.feedbackClient.send('create_feedback', feedbackData)
            );
        } catch (error) {
            this.logger.error('❌ Error creating feedback:', error.message);
            throw error;
        }
    }

    async getAllFeedback() {
        try {
            this.logger.log('📋 Retrieving all feedback via gateway');
            return await lastValueFrom(
                this.feedbackClient.send('get_all_feedback', {})
            );
        } catch (error) {
            this.logger.error('❌ Error retrieving feedback:', error.message);
            throw error;
        }
    }

    async getFeedbackById(id: string) {
        try {
            this.logger.log(`🔍 Retrieving feedback by ID: ${id} via gateway`);
            return await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_id', { id })
            );
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback with ID ${id}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByUserId(userId: string) {
        try {
            this.logger.log(`👤 Retrieving feedback for user: ${userId} via gateway`);
            return await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_user', { userId })
            );
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for user ${userId}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByProductId(productId: string) {
        try {
            this.logger.log(`📦 Retrieving feedback for product: ${productId} via gateway`);
            return await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_product', { productId })
            );
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for product ${productId}:`, error.message);
            throw error;
        }
    }

    async updateFeedback(id: string, updateData: any) {
        try {
            this.logger.log(`✏️ Updating feedback with ID: ${id} via gateway`);
            return await lastValueFrom(
                this.feedbackClient.send('update_feedback', { id, updateData })
            );
        } catch (error) {
            this.logger.error(`❌ Error updating feedback with ID ${id}:`, error.message);
            throw error;
        }
    }

    async deleteFeedback(id: string) {
        try {
            this.logger.log(`🗑️ Deleting feedback with ID: ${id} via gateway`);
            return await lastValueFrom(
                this.feedbackClient.send('delete_feedback', { id })
            );
        } catch (error) {
            this.logger.error(`❌ Error deleting feedback with ID ${id}:`, error.message);
            throw error;
        }
    }
}