import { Schema, Document } from 'mongoose';

export interface Feedback extends Document {
    userId: string;
    productId?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export const FeedbackSchema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});