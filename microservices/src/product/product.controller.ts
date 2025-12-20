import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Res,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
    private readonly logger = new Logger(ProductController.name);

    constructor(private readonly productService: ProductService) { }

    // --- TCP Message Handlers (for API Gateway) ---
    @MessagePattern({ cmd: 'create-product' })
    async createTCP(@Payload() data: any) {
        this.logger.log('TCP: Create Product', data);
        try {
            const { colors, sizes, ...rest } = data;
            let parsedColors = colors;
            let parsedSizes = sizes;

            if (typeof colors === 'string') {
                try { parsedColors = JSON.parse(colors); } catch (e) { }
            }
            if (typeof sizes === 'string') {
                try { parsedSizes = JSON.parse(sizes); } catch (e) { }
            }

            if (Array.isArray(parsedColors)) {
                parsedColors = parsedColors.map(c => typeof c === 'string' ? { name: c.trim(), available: true } : c);
            }
            if (Array.isArray(parsedSizes)) {
                parsedSizes = parsedSizes.map(s => typeof s === 'string' ? { name: s.trim(), available: true } : s);
            }

            const productData = {
                ...rest,
                colors: parsedColors,
                sizes: parsedSizes,
            };

            const product = await this.productService.create(productData);
            this.logger.log('Product created:', product);
            const productObj = (product as any).toObject ? (product as any).toObject() : product;
            return { message: 'Product created successfully', data: productObj };
        } catch (error) {
            this.logger.error('Error creating product (TCP):', error);
            return { status: 'error', message: error.message };
        }
    }

    @MessagePattern({ cmd: 'get-allproducts' })
    async findAllTCP() {
        this.logger.log('TCP: Get All Products');
        const products = await this.productService.findAll();
        // Since the gateway returns the result directly, we wrap it in the expected format if needed. 
        // Client expects {count: number, data: []}
        return { count: products.length, data: products };
    }

    @MessagePattern({ cmd: 'get-product' })
    async findOneTCP(@Payload() id: string) {
        this.logger.log(`TCP: Get Product ${id}`);
        const product = await this.productService.findOne(id);
        if (!product) return null;
        const productData = product.toObject ? product.toObject() : product;
        if (Array.isArray(productData.images)) {
            productData.images = productData.images.map(image =>
                image.startsWith('http') ? image : `http://localhost:4008/uploads/${image}`
            );
        }
        return productData;
    }

    @MessagePattern({ cmd: 'update-product' })
    async updateTCP(@Payload() payload: { id: string; data: any }) {
        this.logger.log(`TCP: Update Product ${payload.id}`);
        const { id, data } = payload;
        if (typeof data.colors === 'string') {
            try { data.colors = JSON.parse(data.colors); } catch (e) { }
        }
        if (typeof data.sizes === 'string') {
            try { data.sizes = JSON.parse(data.sizes); } catch (e) { }
        }
        const updatedProduct = await this.productService.update(id, data);
        return { message: 'Product updated successfully', data: updatedProduct };
    }

    @MessagePattern({ cmd: 'delete-product' })
    async removeTCP(@Payload() id: string) {
        this.logger.log(`TCP: Delete Product ${id}`);
        return await this.productService.delete(id);
    }

    @Post('createproduct')
    @UseInterceptors(FilesInterceptor('images')) // 'images' matches req.files in user code which implies field name 'images' or just files array. The user code used `req.files.map`, which usually means array of files.
    async create(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: any,
        @Res() res: Response,
    ) {
        try {
            this.logger.log('\n=== Product Creation Request ===');
            // Validation logic from user code
            const requiredFields = [
                'name',
                'material',
                'price',
                'stock',
                'category',
                'colors',
                'sizes',
            ];

            const missingFields = requiredFields.filter((field) => !body[field]);
            if (missingFields.length > 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Missing required fields',
                    details: `Please provide: ${missingFields.join(', ')}`,
                    errors: [`Required fields in order: ${missingFields.join(', ')}`],
                });
            }

            if (!files || files.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'At least one image is required',
                    details: 'Please provide at least one product image',
                    errors: ['Required fields in order: images'],
                });
            }

            const price = parseFloat(body.price);
            if (isNaN(price) || price < 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid price',
                    details: 'Price must be a positive number',
                    errors: ['Price must be a positive number'],
                });
            }

            const stock = parseInt(body.stock);
            if (isNaN(stock) || stock < 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid stock',
                    details: 'Stock must be a positive number',
                    errors: ['Stock must be a positive number'],
                });
            }

            const validCategories = [
                'Summer Collection',
                'Winter Collection',
                'Turban Collection',
            ];
            const category = body.category || 'Summer Collection';
            if (!validCategories.includes(category)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid category',
                    details: `Category must be one of: ${validCategories.join(', ')}`,
                    errors: [`Category must be one of: ${validCategories.join(', ')}`],
                });
            }

            let colors;
            try {
                if (typeof body.colors === 'string') {
                    colors = JSON.parse(body.colors);
                } else if (Array.isArray(body.colors)) {
                    colors = body.colors;
                } else {
                    throw new Error('Colors must be a JSON string or array');
                }

                if (!Array.isArray(colors) || colors.length === 0) {
                    throw new Error('At least one color is required');
                }

                colors = colors.map(color => {
                    if (typeof color === 'string') {
                        return { name: color.trim(), available: true };
                    }
                    return {
                        name: (color.name || '').trim(),
                        available: Boolean(color.available)
                    };
                }).filter(color => color.name);

                if (colors.length === 0) {
                    throw new Error('At least one valid color is required');
                }

            } catch (e) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Invalid colors format",
                    details: e.message,
                    errors: [e.message]
                });
            }

            let sizes;
            try {
                if (typeof body.sizes === 'string') {
                    sizes = JSON.parse(body.sizes);
                } else if (Array.isArray(body.sizes)) {
                    sizes = body.sizes;
                } else {
                    throw new Error('Sizes must be a JSON string or array');
                }

                if (!Array.isArray(sizes) || sizes.length === 0) {
                    throw new Error('At least one size is required');
                }

                sizes = sizes.map(size => {
                    if (typeof size === 'string') {
                        return { name: size.trim(), available: true };
                    }
                    return {
                        name: (size.name || '').trim(),
                        available: Boolean(size.available)
                    };
                }).filter(size => size.name);

                if (sizes.length === 0) {
                    throw new Error('At least one valid size is required');
                }

            } catch (e) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Invalid sizes format",
                    details: e.message,
                    errors: [e.message]
                });
            }

            const productData = {
                name: body.name.trim(),
                category,
                material: body.material.trim(),
                price,
                stock,
                colors,
                sizes,
                images: files.map((file) => file.filename),
            };

            const product = await this.productService.create(productData);
            return res.status(HttpStatus.CREATED).json({
                message: 'Product created successfully',
                data: product,
            });

        } catch (error) {
            this.logger.error('Error creating product:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error creating product',
                error: error.message,
            });
        }
    }

    @Get('getallproducts')
    async findAll(@Res() res: Response) {
        try {
            const products = await this.productService.findAll();
            return res.status(HttpStatus.OK).json({
                count: products.length,
                data: products,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }

    @Get('getproduct/:id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid product ID format',
                    details: 'The provided ID is not a valid MongoDB ObjectId',
                });
            }

            const product = await this.productService.findOne(id);
            if (!product) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Product not found',
                    details: `No product matches the ID ${id}`,
                });
            }

            const productData = product.toObject ? product.toObject() : product;
            // Adding full URL to images as per user code
            // Assuming localhost:4008 is the image server or same server
            if (Array.isArray(productData.images)) {
                productData.images = productData.images.map(image =>
                    `http://localhost:4008/uploads/${image}`
                );
            }

            return res.status(HttpStatus.OK).json(productData);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
                details: error.message,
            });
        }
    }

    @Put('updateproduct/:id')
    @UseInterceptors(FilesInterceptor('images'))
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Res() res: Response,
    ) {
        try {
            const existingProduct = await this.productService.findOne(id);
            if (!existingProduct) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Product not found' });
            }

            const updateData: any = {};
            if (body.name) updateData.name = body.name.trim();
            if (body.category) updateData.category = body.category;
            if (body.material) updateData.material = body.material.trim();
            if (body.price) updateData.price = parseFloat(body.price);
            if (body.stock) updateData.stock = parseInt(body.stock);
            if (body.colors) updateData.colors = body.colors; // Should parse if coming as string, but simplifying for update
            if (body.sizes) updateData.sizes = body.sizes;

            if (files && files.length > 0) {
                // In a real app we might delete old files here, but for now we just update
                updateData.images = files.map(file => file.filename);
            }

            const updatedProduct = await this.productService.update(id, updateData);
            return res.json({
                message: 'Product updated successfully',
                data: updatedProduct,
            });

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error updating product",
                error: error.message
            });
        }
    }

    @Delete('deleteproduct/:id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid product ID format',
                    details: 'The provided ID is not a valid MongoDB ObjectId'
                });
            }

            const deleted = await this.productService.delete(id);
            if (deleted.deletedCount === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "Product not found",
                    details: `No product exists with ID: ${id}`
                });
            }

            return res.status(HttpStatus.OK).json({
                message: "Product deleted successfully"
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                details: error.message
            });
        }
    }

    @Post('migrate')
    async migrate(@Res() res: Response) {
        try {
            const result = await this.productService.migrateProducts();
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}



