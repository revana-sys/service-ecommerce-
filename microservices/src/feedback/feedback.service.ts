import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.model';

@Injectable()
export class FeedbackService {
    private readonly logger = new Logger(FeedbackService.name);

    constructor(
        @InjectModel('Feedback') private readonly feedbackModel: Model<Feedback>,
    ) { }

    async createFeedback(feedbackData: any): Promise<Feedback> {
        try {
            const feedback = new this.feedbackModel(feedbackData);
            const savedFeedback = await feedback.save();
            this.logger.log(`✅ Feedback created with ID: ${savedFeedback._id}`);
            return savedFeedback;
        } catch (error) {
            this.logger.error('❌ Error creating feedback:', error.message);
            throw error;
        }
    }

    async getAllFeedback(): Promise<Feedback[]> {
        try {
            const feedback = await this.feedbackModel.find().sort({ createdAt: -1 });
            this.logger.log(`✅ Retrieved ${feedback.length} feedback entries`);
            return feedback;
        } catch (error) {
            this.logger.error('❌ Error retrieving feedback:', error.message);
            throw error;
        }
    }

    async getFeedbackById(id: string): Promise<Feedback> {
        try {
            const feedback = await this.feedbackModel.findById(id);
            if (!feedback) {
                throw new Error('Feedback not found');
            }
            this.logger.log(`✅ Retrieved feedback with ID: ${id}`);
            return feedback;
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback with ID ${id}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByUserId(userId: string): Promise<Feedback[]> {
        try {
            const feedback = await this.feedbackModel.find({ userId }).sort({ createdAt: -1 });
            this.logger.log(`✅ Retrieved ${feedback.length} feedback entries for user: ${userId}`);
            return feedback;
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for user ${userId}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByProductId(productId: string): Promise<Feedback[]> {
        try {
            const feedback = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 });
            this.logger.log(`✅ Retrieved ${feedback.length} feedback entries for product: ${productId}`);
            return feedback;
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for product ${productId}:`, error.message);
            throw error;
        }
    }

    async updateFeedback(id: string, updateData: any): Promise<Feedback> {
        try {
            updateData.updatedAt = new Date();
            const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
            if (!updatedFeedback) {
                throw new Error('Feedback not found');
            }
            this.logger.log(`✅ Updated feedback with ID: ${id}`);
            return updatedFeedback;
        } catch (error) {
            this.logger.error(`❌ Error updating feedback with ID ${id}:`, error.message);
            throw error;
        }
    }

    async deleteFeedback(id: string): Promise<void> {
        try {
            const result = await this.feedbackModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Feedback not found');
            }
            this.logger.log(`✅ Deleted feedback with ID: ${id}`);
        } catch (error) {
            this.logger.error(`❌ Error deleting feedback with ID ${id}:`, error.message);
            throw error;
        }
    }
}