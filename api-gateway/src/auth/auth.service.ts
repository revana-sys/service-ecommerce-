import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MICROSERVICES_SERVICE') private readonly client: ClientProxy,
  ) { }

  async signup(data: any) {
    return lastValueFrom(this.client.send({ cmd: 'auth-signup' }, data));
  }

  async signupAdmin(data: any) {
    return lastValueFrom(this.client.send({ cmd: 'admin-signup' }, data));
  }

  async login(data: any) {
    return lastValueFrom(this.client.send({ cmd: 'auth-login' }, data));
  }

  async loginAdmin(data: any) {
    return lastValueFrom(this.client.send({ cmd: 'admin-login' }, data));
  }

  async getAllUsers() {
    return lastValueFrom(this.client.send({ cmd: 'get-all-users' }, {}));
  }

  async getUserById(id: string) {
    return lastValueFrom(this.client.send({ cmd: 'get-user-by-id' }, id));
  }
}
