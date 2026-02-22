import { CustomError } from './customError.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

export class Validator {
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
  static async validateLogin(password: string, DBPassword: string) {
    // check if password is provided
    if (!password) {
      throw new CustomError(
        'invalid email or password',
        StatusCodes.UNAUTHORIZED,
      );
    }
    // If DBPassword is falsy (user not found), comparison will fail safely
    const isMatch = DBPassword
      ? await bcrypt.compare(password, DBPassword)
      : false;
    // check if the password is not matched
    if (!isMatch) {
      throw new CustomError('invalid password', StatusCodes.UNAUTHORIZED);
    }
  }
}
