/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}
