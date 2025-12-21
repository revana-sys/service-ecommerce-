import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(@InjectModel('Admin') private readonly adminModel: Model<Admin>) {}

  async getAdminDashboard(email: string) {
    try {
      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        return { status: 'error', message: 'Admin not found' };
      }

      return {
        status: 'success',
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching admin dashboard:', error);
      return { status: 'error', message: 'Failed to fetch dashboard' };
    }
  }

  async updateAdminProfile(email: string, updateData: any) {
    try {
      const admin = await this.adminModel.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );

      if (!admin) {
        return { status: 'error', message: 'Admin not found' };
      }

      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: admin,
      };
    } catch (error) {
      this.logger.error('Error updating admin profile:', error);
      return { status: 'error', message: 'Failed to update profile' };
    }
  }

  async getAllAdmins() {
    try {
      const admins = await this.adminModel.find({}, { __v: 0 });
      return {
        status: 'success',
        data: admins,
      };
    } catch (error) {
      this.logger.error('Error fetching admins:', error);
      return { status: 'error', message: 'Failed to fetch admins' };
    }
  }
}
