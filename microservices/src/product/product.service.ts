
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) { }

  async create(productData: any): Promise<Product> {
    const newProduct = new this.productModel(productData);
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    // Clean image paths logic from user code
    return products.map((product) => {
      const productObj = product.toObject() as Product;
      if (productObj.images) {
        productObj.images = productObj.images.map((img) =>
          this.cleanImagePath(img),
        );
      }
      return productObj;
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) return null;

    // Logic from user's getProductById
    const productData = product.toObject() as Product;
    if (!productData.images || !Array.isArray(productData.images)) {
      productData.images = [];
    }
    // Note: The user's code appended 'http://localhost:4008/uploads/' in the controller.
    // We'll leave that transformation for the controller or doing it here if preferred. 
    // The user's code had it in getProductById controller.
    return product as Product;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return await this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return await this.productModel.deleteOne({ _id: id }).exec();
  }

  // Helper from user code
  cleanImagePath(imagePath: string): string {
    return imagePath.replace(/^\/?uploads\//, '');
  }

  // Migration logic from user code
  async checkAndFixProductSchema(product: any): Promise<boolean> {
    this.logger.log(`Checking Product Schema for ID: ${product._id}`);
    try {
      // Check and fix colors
      if (typeof product.colors === 'string') {
        try {
          product.colors = JSON.parse(product.colors);
        } catch (e) {
          product.colors = [];
        }
      } else if (!Array.isArray(product.colors)) {
        product.colors = [];
      }

      // Check and fix sizes
      if (!Array.isArray(product.sizes)) {
        product.sizes = [];
      }

      // Check and fix category
      if (!product.category) {
        product.category = 'Summer Collection';
      }

      // Clean image path (legacy single image field if exists)
      if (product.image) {
        const oldImagePath = product.image;
        const newImagePath = this.cleanImagePath(oldImagePath);
        if (oldImagePath !== newImagePath) {
          product.image = newImagePath;
        }
      }

      // Validate colors format
      product.colors = product.colors
        .map((color) => {
          if (typeof color === 'string') {
            return { name: color.trim(), available: true };
          }
          return {
            name: String(color.name || '').trim(),
            available: Boolean(color.available),
          };
        })
        .filter((color) => color.name);

      // Validate sizes format
      product.sizes = product.sizes
        .map((size) => {
          if (typeof size === 'string') {
            return { name: size.trim(), available: true };
          }
          return {
            name: String(size.name || '').trim(),
            available: Boolean(size.available),
          };
        })
        .filter((size) => size.name);

      // If no sizes exist, add a default size
      if (product.sizes.length === 0) {
        product.sizes.push({ name: 'One Size', available: true });
      }

      // This part assumes we are working with a Mongoose document that has .save()
      // If 'product' passed here is a document, this works.
      if (typeof product.save === 'function') {
        await product.save();
      } else {
        // If it's a plain object, we'd need to update via model
        await this.productModel.findByIdAndUpdate(product._id, product);
      }

      return true;
    } catch (error) {
      this.logger.error(`Error updating product schema: ${error}`);
      return false;
    }
  }

  async migrateProducts(): Promise<{ message: string }> {
    const products = await this.productModel.find({});
    let migratedCount = 0;

    for (const product of products) {
      const updated = await this.checkAndFixProductSchema(product);
      if (updated) migratedCount++;
    }

    return { message: `Migration completed: ${migratedCount} products updated.` };
  }
}
