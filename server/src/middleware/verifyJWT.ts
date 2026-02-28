import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/User.js';
import { ENV } from '../lib/env.js';
import { CustomError } from '../utils/customError.js';
import { StatusCodes } from 'http-status-codes';
import type { Request, Response, NextFunction } from 'express';

// define jwt structure
interface jwtPayload {
  userId: string;
}

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new CustomError(
        'Unauthorized - No token provided',
        StatusCodes.UNAUTHORIZED,
      );
    }

    let decoded: jwtPayload;
    // Inner try-catch specifically for JWT verification
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET_KEY) as jwtPayload;
    } catch (error) {
      // Convert JWT errors to proper 401 responses
      throw new CustomError(
        'Unauthorized - invalid token',
        StatusCodes.UNAUTHORIZED,
      );
    }
    // // Validate payload
    if (!decoded.userId) {
      throw new CustomError(
        'Unauthorized - invalid token',
        StatusCodes.UNAUTHORIZED,
      );
    }
    // Validate MongoDB ObjectId format BEFORE querying
    if (!isValidObjectId(decoded.userId)) {
      throw new CustomError(
        'Unauthorized - invalid token',
        StatusCodes.UNAUTHORIZED,
      );
    }
    // Find user by id
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
