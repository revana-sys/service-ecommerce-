import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authService.signup(body);
      console.log('Auth Signup Result from Microservice:', result);

      if (result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      console.error('Auth Gateway Error:', e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authService.login(body);
      if (result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Post('admin/signup')
  async signupAdmin(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authService.signupAdmin(body);
      if (result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Post('admin/login')
  async loginAdmin(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.authService.loginAdmin(body);
      if (result.status === 'error') {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Get('users')
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.authService.getAllUsers();
      return res.status(HttpStatus.OK).json({ count: users.length, data: users });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
      return res.status(HttpStatus.OK).json(user);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }
}
