import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';
import type { UserDocument } from '../models/User.js';

export class Validator {
  // signup check
  static validateSignup(name: string, email: string, password: string) {
    // check if all credentials is provided
    if (!name || !email || !password) {
      throw new CustomError('All fields are required', StatusCodes.BAD_REQUEST);
    }

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // check if the email is valid
    if (!emailRegEx.test(email)) {
      throw new CustomError('invalid credentials', StatusCodes.BAD_REQUEST);
    }

    const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    // check if the password is valid
    if (!passRegEx.test(password)) {
      throw new CustomError(
        'Must contain uppercase, lowercase, number, and special character.',
        StatusCodes.BAD_REQUEST,
      );
    }
  }
  // login check
  static async validateLogin(password: string, user: UserDocument | null) {
    if(!user || !(await user.comparePassword(password))) {
      throw new CustomError('invalid email or password', StatusCodes.UNAUTHORIZED);
    }
  }
}
