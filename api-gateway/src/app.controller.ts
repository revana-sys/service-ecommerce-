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
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

// Multer Config
const storage = diskStorage({
  destination: '../uploads', // Shared uploads directory
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('product')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('createproduct')
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async create(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    try {
      const productData = { ...body };
      if (files && files.length > 0) {
        productData.images = files.map((f) => f.filename);
      }
      const result = await this.appService.createProduct(productData);
      console.log('Gateway received from Microservice:', result);

      // Handle TCP error responses
      if (result && result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  @Get('getallproducts')
  async findAll(@Res() res: Response) {
    try {
      const result = await this.appService.getAllproducts();
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  @Get('getproduct/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.appService.getProductById(id);
      if (!result) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Product not found' });
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  @Put('updateproduct/:id')
  @UseInterceptors(FilesInterceptor('images', 10, { storage }))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    try {
      const updateData = { ...body };
      if (files && files.length > 0) {
        updateData.images = files.map((f) => f.filename);
      }
      const result = await this.appService.updateProductById(id, updateData);
      if (result && result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  @Delete('deleteproduct/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.appService.DeleteProductById(id);
      if (result && result.deletedCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
      }
      return res.json({ message: 'Product deleted successfully', result });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
}
