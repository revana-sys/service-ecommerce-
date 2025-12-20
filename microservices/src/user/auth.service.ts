import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }

  async signup(data: any) {
    const { name, email, password, confirmPassword } = data;
    if (!name || !email || !password || !confirmPassword) {
      return { status: 'error', message: 'All fields are required' };
    }
    if (password !== confirmPassword) {
      return { status: 'error', message: 'Passwords do not match' };
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return { status: 'error', message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
    });
    await newUser.save();

    const token = this.jwtService.sign({ userId: newUser._id, role: newUser.role }, { secret: 'secretkey' });

    return {
      status: 'success',
      message: 'Customer created successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    };
  }

  async signupAdmin(data: any) {
    const { name, email, password, confirmPassword } = data;
    if (!name || !email || !password || !confirmPassword) {
      return { status: 'error', message: 'All fields are required' };
    }
    if (password !== confirmPassword) {
      return { status: 'error', message: 'Passwords do not match' };
    }
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return { status: 'error', message: 'Email already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    await newUser.save();

    const token = this.jwtService.sign({ userId: newUser._id, role: newUser.role }, { secret: 'secretkey' });

    return {
      status: 'success',
      message: 'Admin created successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    };
  }

  async login(data: any) {
    const { email, password } = data;
    if (!email || !password) return { status: 'error', message: 'All fields are required' };

    const user = await this.userModel.findOne({ email });
    if (!user || user.role !== 'customer') {
      return { status: 'error', message: 'Customer not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 'error', message: 'Invalid credentials' };
    }

    const token = this.jwtService.sign({ userId: user._id, role: user.role }, { secret: 'secretkey' });
    return {
      status: 'success',
      message: 'Customer login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async loginAdmin(data: any) {
    const { email, password } = data;
    if (!email || !password) return { status: 'error', message: 'All fields are required' };

    const user = await this.userModel.findOne({ email });
    if (!user || user.role !== 'admin') {
      return { status: 'error', message: 'Admin not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 'error', message: 'Invalid credentials' };
    }

    const token = this.jwtService.sign({ userId: user._id, role: user.role }, { secret: 'secretkey' });
    return {
      status: 'success',
      message: 'Admin login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async getAllUsers() {
    return await this.userModel.find({}, { password: 0 });
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id, { password: 0 });
  }
}
