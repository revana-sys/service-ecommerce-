/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

// Order Item Schema - represents individual items in an order
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  selectedColor: {
    type: Object,
    default: null,
  },
  selectedSize: {
    type: Object,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
});

// Customer Info Schema - embedded in order
const CustomerInfoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'online'],
    default: 'cash',
  },
});

// Main Order Schema
export const OrderSchema = new mongoose.Schema(
  {
    customerInfo: {
      type: CustomerInfoSchema,
      required: [true, 'Customer information is required'],
    },
    orderItems: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items: any[]) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Interfaces for TypeScript type safety
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: { name: string; available: boolean } | null;
  selectedSize?: { name: string; available: boolean } | null;
  image?: string | null;
}

export interface CustomerInfo {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'online';
}

export interface Order extends mongoose.Document {
  id: string;
  customerInfo: CustomerInfo;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
