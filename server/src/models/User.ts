import { Schema, model, Types, Model, type HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';

export type UserDocument = HydratedDocument<Iuser, IuserMethods>;

// Define TS interface
export interface Iuser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IuserMethods {
  createJWT(): string;
}

// Iuser => Document shape (fields)
// Model<Iuser, {}, IuserMethods>, => Model type
// IuserMethods => Instance methods

// Create user Schema
const userSchema = new Schema<
  Iuser,
  Model<Iuser, {}, IuserMethods>,
  IuserMethods
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

userSchema.methods.createJWT = function (): string {
  if (!ENV.JWT_SECRET_KEY || isNaN(Number(ENV.JWT_EXPIRES_IN))) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  return jwt.sign({ userId: this._id.toString() }, ENV.JWT_SECRET_KEY, {
    expiresIn: `${Number(ENV.JWT_EXPIRES_IN)}d`,
  });
};

export const User = model<Iuser, Model<Iuser, {}, IuserMethods>>(
  'User',
  userSchema,
);
