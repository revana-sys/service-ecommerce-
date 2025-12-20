import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @MessagePattern({ cmd: 'auth-signup' })
  async signup(@Payload() data: any) {
    this.logger.log('TCP: Auth Signup');
    return await this.authService.signup(data);
  }

  @MessagePattern({ cmd: 'admin-signup' })
  async signupAdmin(@Payload() data: any) {
    this.logger.log('TCP: Admin Signup');
    return await this.authService.signupAdmin(data);
  }

  @MessagePattern({ cmd: 'auth-login' })
  async login(@Payload() data: any) {
    this.logger.log('TCP: Auth Login');
    return await this.authService.login(data);
  }

  @MessagePattern({ cmd: 'admin-login' })
  async loginAdmin(@Payload() data: any) {
    this.logger.log('TCP: Admin Login');
    return await this.authService.loginAdmin(data);
  }

  @MessagePattern({ cmd: 'get-all-users' })
  async getAllUsers() {
    this.logger.log('TCP: Get All Users');
    return await this.authService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  async getUserById(@Payload() id: string) {
    this.logger.log(`TCP: Get User By ID ${id}`);
    return await this.authService.getUserById(id);
  }
}
