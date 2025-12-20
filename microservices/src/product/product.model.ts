import * as mongoose from 'mongoose';

// Color schema
const ColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Size schema
const SizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Size name is required'],
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Summer Collection', 'Winter Collection', 'Turban Collection'],
        message: '{VALUE} is not a valid category',
      },
      trim: true,
      default: 'Summer Collection',
    },
    material: {
      type: String,
      required: [true, 'Material is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    colors: [ColorSchema],
    sizes: [SizeSchema],
    images: [{
      type: String,
      required: true
    }],
  },
  { timestamps: true }
);

export interface Product extends mongoose.Document {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  colors: { name: string; available: boolean }[];
  sizes: { name: string; available: boolean }[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
