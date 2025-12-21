import { Controller, Get, Put, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import type { Request, Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getAdminDashboard(@Req() req: Request, @Res() res: Response) {
    try {
      const email = (req as any).user?.email || (req.body as any)?.email;
      
      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Email is required',
        });
      }

      const result = await this.adminService.getAdminDashboard(email);
      
      if (result.status === 'error') {
        return res.status(HttpStatus.NOT_FOUND).json(result);
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Put('profile')
  async updateAdminProfile(
    @Body() body: { email: string; updateData: any },
    @Res() res: Response
  ) {
    try {
      const { email, updateData } = body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Email is required',
        });
      }

      const result = await this.adminService.updateAdminProfile(email, updateData);

      if (result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('all')
  async getAllAdmins(@Res() res: Response) {
    try {
      const result = await this.adminService.getAllAdmins();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
