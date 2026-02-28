import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../utils/validator.js';
import { CustomError } from '../utils/customError.js';
import { User, type UserDocument } from '../models/User.js';
import { welcomeEmail } from '../email/emailHandler.js';
import { ENV } from '../lib/env.js';
import { TokenHandler } from '../utils/tokenHandler.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req: Request, res: Response) => {
  // destruct credentials from req.body
  const { name, email, password } = req.body;
  // validate using Validator class
  Validator.validateSignup(name, email, password);
  // check if email is existed
  const duplicate = await User.findOne({ email }).lean();
  if (duplicate) {
    throw new CustomError('This email already exist', StatusCodes.BAD_REQUEST);
  }
  // create user
  const user: UserDocument = await User.create({
    name,
    email,
    password,
  });
  // send welcom email to the user
  try {
    await welcomeEmail(user.name, user.email, ENV.CLIENT_URL);
  } catch (error) {
    console.log(error);
  }
  // create json web token
  const token = user.createJWT();
  // custom token handler for cookie
  TokenHandler.attachCookie(res, token);
  // send the response
  res
    .status(StatusCodes.CREATED)
    .json({ user: { id: user._id }, message: 'User created successfully' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(
      "you need to signup first if you don't have an account ",
      StatusCodes.UNAUTHORIZED,
    );
  }
  // validate login
  await Validator.validateLogin(password, user);
  // create jwt
  const token = user.createJWT();
  // attach cookie to the response
  TokenHandler.attachCookie(res, token);

  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email },
    message: 'user logged in successfully',
  });
};

export const logout = async (req: Request, res: Response) => {
  TokenHandler.clearCookie(res);
  res.status(StatusCodes.OK).json({ message: 'user logged out successfully' });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { avatar } = req.body;

  // Validate avatar exists
  // check all falsy value (null, undefined, "", 0, NaN, false)
  if (!avatar) {
    throw new CustomError('Avatar is required', StatusCodes.BAD_REQUEST);
  }

  // Security: Only accept base64 data URIs
  const isBase64DataUri = /^data:image\/(jpg|jpeg|png|webp);base64,/.test(
    avatar,
  );
  if (!isBase64DataUri) {
    throw new CustomError(
      'Avatar must be a base64 encoded image (jpeg, png, or webp)',
      StatusCodes.BAD_REQUEST,
    );
  }

  // Validate userId
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
  }

  // Upload to Cloudinary
  let uploadResponse;
  try {
    uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 400,
      height: 400,
      crop: 'fill',
      allowed_formats: ['jpg', 'png', 'webp'],
    });
  } catch (error) {
    throw new CustomError('Failed to upload avatar', StatusCodes.BAD_REQUEST);
  }
  

  // Update user in database
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: uploadResponse.secure_url },
    { new: true, runValidators: true },
  ).select('-password');

  if (!updatedUser) {
    throw new CustomError('User not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true, user: updatedUser });
};
