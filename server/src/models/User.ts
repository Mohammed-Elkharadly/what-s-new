import { Schema, model, Types, Model, type HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ENV } from '../lib/env.js';

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// Define TS interface
export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IUserMethods {
  createJWT(): string;
  comparePassword(candidate: string): Promise<boolean>;
}

// Iuser => Document shape (fields)
// Model<Iuser, {}, IuserMethods>, => Model type
// IuserMethods => Instance methods

// Create user Schema
const userSchema = new Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// auto-hash runs everytime we save a user, "before"
userSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// password hashing middleware used during login, "custom methods"
userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

// crcate jwt token, "custom methods"
userSchema.methods.createJWT = function (this: UserDocument): string {
  if (!ENV.JWT_SECRET_KEY || isNaN(Number(ENV.JWT_EXPIRES_IN))) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  return jwt.sign({ userId: this._id.toString() }, ENV.JWT_SECRET_KEY, {
    expiresIn: `${Number(ENV.JWT_EXPIRES_IN)}d`,
  });
};

export const User = model<IUser, Model<IUser, {}, IUserMethods>>(
  'User',
  userSchema,
);
