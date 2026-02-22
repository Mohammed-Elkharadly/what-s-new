import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Validator } from '../utils/validator.js';
import { CustomError } from '../utils/customError.js';
import { User, type UserDocument } from '../models/User.js';
import bcrypt from 'bcrypt';
import { welcomeEmail } from '../email/emailHandler.js';
import { ENV } from '../lib/env.js';
import { TokenHandler } from '../utils/tokenHandler.js';

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
  // hashing paswword
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create user
  const user: UserDocument = await User.create({
    name,
    email,
    password: hashedPassword,
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
    throw new CustomError('you need to signup first', StatusCodes.UNAUTHORIZED);
  }
  // validate login
  await Validator.validateLogin(password, user.password);
  // create jwt
  const token = user.createJWT();
  // attach cookie to the response
  TokenHandler.attachCookie(res, token);
  res
    .status(StatusCodes.OK)
    .json({
      user: {
        name: user.name,
        email: user.email,
        message: 'user logged in successfully',
      },
    });
};

export const logout = async (req: Request, res: Response) => {
  TokenHandler.clearCookie(res);
  res.status(StatusCodes.OK).json({ message: 'logged out successfully' });
};
