import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FeedbackService {
    private readonly logger = new Logger(FeedbackService.name);

    constructor(
        @Inject('FEEDBACK_SERVICE') private readonly feedbackClient: ClientProxy,
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
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
            const feedback = await lastValueFrom(
                this.feedbackClient.send('get_all_feedback', {})
            );
            
            // Enhance feedback with user and product names
            const enhancedFeedback = await Promise.all(feedback.map(async (fb) => {
                let customerName = fb.userId;
                let email = '';
                let productName = fb.productId || 'General Feedback';
                
                try {
                    // Fetch user info if userId exists
                    if (fb.userId) {
                        try {
                            const userResponse = await lastValueFrom(
                                this.userClient.send({ cmd: 'get-user-by-id' }, fb.userId)
                            );
                            if (userResponse && userResponse.name) {
                                customerName = userResponse.name;
                                email = userResponse.email || '';
                            }
                        } catch (userError) {
                            this.logger.warn(`Could not fetch user info for ID ${fb.userId}:`, userError.message);
                        }
                    }
                    
                    // Fetch product info if productId exists
                    if (fb.productId) {
                        try {
                            const productResponse = await lastValueFrom(
                                this.productClient.send({ cmd: 'get-product' }, fb.productId)
                            );
                            if (productResponse && productResponse.name) {
                                productName = productResponse.name;
                            }
                        } catch (productError) {
                            this.logger.warn(`Could not fetch product info for ID ${fb.productId}:`, productError.message);
                        }
                    }
                } catch (error) {
                    this.logger.error('Error fetching user or product info:', error.message);
                }
                
                return {
                    ...fb,
                    customerName,
                    email,
                    productName
                };
            }));
            
            return enhancedFeedback;
        } catch (error) {
            this.logger.error('❌ Error retrieving feedback:', error.message);
            throw error;
        }
    }

    async getFeedbackById(id: string) {
        try {
            this.logger.log(`🔍 Retrieving feedback by ID: ${id} via gateway`);
            const feedback = await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_id', { id })
            );
            
            let customerName = feedback.userId;
            let email = '';
            let productName = feedback.productId || 'General Feedback';
            
            try {
                // Fetch user info if userId exists
                if (feedback.userId) {
                    try {
                        const userResponse = await lastValueFrom(
                            this.userClient.send({ cmd: 'get-user-by-id' }, feedback.userId)
                        );
                        if (userResponse && userResponse.name) {
                            customerName = userResponse.name;
                            email = userResponse.email || '';
                        }
                    } catch (userError) {
                        this.logger.warn(`Could not fetch user info for ID ${feedback.userId}:`, userError.message);
                    }
                }
                
                // Fetch product info if productId exists
                if (feedback.productId) {
                    try {
                        const productResponse = await lastValueFrom(
                            this.productClient.send({ cmd: 'get-product' }, feedback.productId)
                        );
                        if (productResponse && productResponse.name) {
                            productName = productResponse.name;
                        }
                    } catch (productError) {
                        this.logger.warn(`Could not fetch product info for ID ${feedback.productId}:`, productError.message);
                    }
                }
            } catch (error) {
                this.logger.error('Error fetching user or product info:', error.message);
            }
            
            return {
                ...feedback,
                customerName,
                email,
                productName
            };
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback with ID ${id}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByUserId(userId: string) {
        try {
            this.logger.log(`👤 Retrieving feedback for user: ${userId} via gateway`);
            const feedback = await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_user', { userId })
            );
            
            // Enhance feedback with user and product names
            const enhancedFeedback = await Promise.all(feedback.map(async (fb) => {
                let customerName = fb.userId;
                let email = '';
                let productName = fb.productId || 'General Feedback';
                
                try {
                    // Fetch user info if userId exists
                    if (fb.userId) {
                        try {
                            const userResponse = await lastValueFrom(
                                this.userClient.send({ cmd: 'get-user-by-id' }, fb.userId)
                            );
                            if (userResponse && userResponse.name) {
                                customerName = userResponse.name;
                                email = userResponse.email || '';
                            }
                        } catch (userError) {
                            this.logger.warn(`Could not fetch user info for ID ${fb.userId}:`, userError.message);
                        }
                    }
                    
                    // Fetch product info if productId exists
                    if (fb.productId) {
                        try {
                            const productResponse = await lastValueFrom(
                                this.productClient.send({ cmd: 'get-product' }, fb.productId)
                            );
                            if (productResponse && productResponse.name) {
                                productName = productResponse.name;
                            }
                        } catch (productError) {
                            this.logger.warn(`Could not fetch product info for ID ${fb.productId}:`, productError.message);
                        }
                    }
                } catch (error) {
                    this.logger.error('Error fetching user or product info:', error.message);
                }
                
                return {
                    ...fb,
                    customerName,
                    email,
                    productName
                };
            }));
            
            return enhancedFeedback;
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for user ${userId}:`, error.message);
            throw error;
        }
    }

    async getFeedbackByProductId(productId: string) {
        try {
            this.logger.log(`📦 Retrieving feedback for product: ${productId} via gateway`);
            const feedback = await lastValueFrom(
                this.feedbackClient.send('get_feedback_by_product', { productId })
            );
            
            // Enhance feedback with user and product names
            const enhancedFeedback = await Promise.all(feedback.map(async (fb) => {
                let customerName = fb.userId;
                let email = '';
                let productName = fb.productId || 'General Feedback';
                
                try {
                    // Fetch user info if userId exists
                    if (fb.userId) {
                        try {
                            const userResponse = await lastValueFrom(
                                this.userClient.send({ cmd: 'get-user-by-id' }, fb.userId)
                            );
                            if (userResponse && userResponse.name) {
                                customerName = userResponse.name;
                                email = userResponse.email || '';
                            }
                        } catch (userError) {
                            this.logger.warn(`Could not fetch user info for ID ${fb.userId}:`, userError.message);
                        }
                    }
                    
                    // Fetch product info if productId exists
                    if (fb.productId) {
                        try {
                            const productResponse = await lastValueFrom(
                                this.productClient.send({ cmd: 'get-product' }, fb.productId)
                            );
                            if (productResponse && productResponse.name) {
                                productName = productResponse.name;
                            }
                        } catch (productError) {
                            this.logger.warn(`Could not fetch product info for ID ${fb.productId}:`, productError.message);
                        }
                    }
                } catch (error) {
                    this.logger.error('Error fetching user or product info:', error.message);
                }
                
                return {
                    ...fb,
                    customerName,
                    email,
                    productName
                };
            }));
            
            return enhancedFeedback;
        } catch (error) {
            this.logger.error(`❌ Error retrieving feedback for product ${productId}:`, error.message);
            throw error;
        }
    }

    async updateFeedback(id: string, updateData: any) {
        try {
            this.logger.log(`✏️ Updating feedback with ID: ${id} via gateway`);
            const feedback = await lastValueFrom(
                this.feedbackClient.send('update_feedback', { id, updateData })
            );
            
            let customerName = feedback.userId;
            let email = '';
            let productName = feedback.productId || 'General Feedback';
            
            try {
                // Fetch user info if userId exists
                if (feedback.userId) {
                    try {
                        const userResponse = await lastValueFrom(
                            this.userClient.send({ cmd: 'get-user-by-id' }, feedback.userId)
                        );
                        if (userResponse && userResponse.name) {
                            customerName = userResponse.name;
                            email = userResponse.email || '';
                        }
                    } catch (userError) {
                        this.logger.warn(`Could not fetch user info for ID ${feedback.userId}:`, userError.message);
                    }
                }
                
                // Fetch product info if productId exists
                if (feedback.productId) {
                    try {
                        const productResponse = await lastValueFrom(
                            this.productClient.send({ cmd: 'get-product' }, feedback.productId)
                        );
                        if (productResponse && productResponse.name) {
                            productName = productResponse.name;
                        }
                    } catch (productError) {
                        this.logger.warn(`Could not fetch product info for ID ${feedback.productId}:`, productError.message);
                    }
                }
            } catch (error) {
                this.logger.error('Error fetching user or product info:', error.message);
            }
            
            return {
                ...feedback,
                customerName,
                email,
                productName
            };
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