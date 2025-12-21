import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(
    @Inject('MICROSERVICES_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getAdminDashboard(email: string) {
    return lastValueFrom(this.client.send({ cmd: 'admin-dashboard' }, { email }));
  }

  async updateAdminProfile(email: string, updateData: any) {
    return lastValueFrom(
      this.client.send({ cmd: 'admin-update-profile' }, { email, updateData })
    );
  }

  async getAllAdmins() {
    return lastValueFrom(this.client.send({ cmd: 'admin-get-all' }, {}));
  }
}
