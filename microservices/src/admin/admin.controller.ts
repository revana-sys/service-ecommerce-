import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @MessagePattern({ cmd: 'admin-dashboard' })
  async getAdminDashboard(@Payload() data: { email: string }) {
    this.logger.log('TCP: Get Admin Dashboard');
    return await this.adminService.getAdminDashboard(data.email);
  }

  @MessagePattern({ cmd: 'admin-update-profile' })
  async updateAdminProfile(@Payload() data: { email: string; updateData: any }) {
    this.logger.log('TCP: Update Admin Profile');
    return await this.adminService.updateAdminProfile(data.email, data.updateData);
  }

  @MessagePattern({ cmd: 'admin-get-all' })
  async getAllAdmins() {
    this.logger.log('TCP: Get All Admins');
    return await this.adminService.getAllAdmins();
  }
}
