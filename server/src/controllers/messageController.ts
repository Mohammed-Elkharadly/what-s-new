import type { Request, Response } from 'express';
import { type QueryFilter, Types } from 'mongoose';
import type { MessageDocument } from '../models/Message.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { CustomError } from '../utils/customError.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../lib/cloudinary.js';

export const getAllContacts = async (req: Request, res: Response) => {
  // get the logged in user id from the request object (set by the authentication middleware)
  const loggedInUserId = req.user?._id;
  if (!loggedInUserId) {
    throw new CustomError(
      'Unauthorized: User not logged in',
      StatusCodes.UNAUTHORIZED,
    );
  }
  // find all users except the logged in user and exclude the password field
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId }, // exclude the logged in user from the results
  }).select('-password');
  // if no contacts are found, return an empty array
  if (filteredUsers?.length === 0) {
    res.status(StatusCodes.OK).json({ contacts: [] });
    return;
  }
  // return the filtered users as contacts
  res.status(StatusCodes.OK).json({ contacts: filteredUsers });
};

export const getMessageByUserId = async (req: Request, res: Response) => {
  // get the logged in user id from the request object (set by the authentication middleware)
  const loggedInUserId = req.user?._id;
  if (!loggedInUserId) {
    throw new CustomError(
      'Unauthorized: User not logged in',
      StatusCodes.UNAUTHORIZED,
    );
  }
  // get the user id from the request parameters
  const { id: otherUserId } = req.params;
  // Validate first: check if it's a string and valid ObjectId format
  if (typeof otherUserId !== 'string' || !Types.ObjectId.isValid(otherUserId)) {
    throw new CustomError('Invalid user ID format', StatusCodes.BAD_REQUEST);
  }
  // convert the user id to a mongoose ObjectId
  const senderObjectId = new Types.ObjectId(loggedInUserId);
  const receiverObjectId = new Types.ObjectId(otherUserId);

  // QueryFilter is a type that represents the filter object used in Mongoose queries
  const filter: QueryFilter<MessageDocument> = {
    // $or means either of the conditions can be true
    $or: [
      { senderId: senderObjectId, receiverId: receiverObjectId },
      { senderId: receiverObjectId, receiverId: senderObjectId },
    ],
  };
  // find all messages between the logged in user and the other user, sorted by creation date
  const messages = await Message.find(filter).sort({ createdAt: 1 });

  if (messages?.length === 0) {
    // Return empty array if no conversation exists yet between the users
    res.status(StatusCodes.OK).json({ messages: [] });
    return;
  }
  // return the messages as a response
  res.status(StatusCodes.OK).json({ messages });
};

export const sendMessage = async (req: Request, res: Response) => {
  // extract content and image from the request body 'destructuring'
  const { content, image } = req.body;

  if (!content && !image) {
    throw new CustomError(
      'Message must contain a content or an image',
      StatusCodes.BAD_REQUEST,
    );
  }

  // extract receiverId from the request parameters
  const { id } = req.params;

  // Type guard: ensure it's a string
  if (!id || Array.isArray(id)) {
    throw new CustomError('Receiver ID is required', StatusCodes.BAD_REQUEST);
  }

  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError(
      'Invalid receiver ID format',
      StatusCodes.BAD_REQUEST,
    );
  }

  // convert to ObjectId
  const receiverId = new Types.ObjectId(id);

  // get the logged in user id from the request object (set by the authentication middleware)
  const senderId = req.user?._id;

  if (!senderId) {
    throw new CustomError(
      'Unauthorized: User not logged in',
      StatusCodes.UNAUTHORIZED,
    );
  }

  if (senderId.equals(receiverId)) {
    throw new CustomError(
      'Cannot send message to yourself',
      StatusCodes.BAD_REQUEST,
    );
  }

  let imageUrl: string | null = null;

  if (image) {
    const isBase64DataUri = /^data:image\/(jpg|jpeg|png|webp|gif);base64,/.test(
      image,
    );

    if (!isBase64DataUri) {
      throw new CustomError('Invalid image format', StatusCodes.BAD_REQUEST);
    }

    try {
      // upload Base64 image to Cloudinary and get the URL
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chat-app/messages',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      throw new CustomError('Failed to upload image', StatusCodes.BAD_REQUEST);
    }
  }

  // verify reveiver exist
  const receiverExists = await User.exists(receiverId);
  if (!receiverExists) {
    throw new CustomError('Receiver not found', StatusCodes.NOT_FOUND);
  }

  // create a new message document in the DB
  const newMessage = new Message({
    senderId,
    receiverId,
    isRead: false,
    content,
    image: imageUrl,
  });
  await newMessage.save();
  // return the created message as a response
  res.status(StatusCodes.CREATED).json({ message: newMessage });
};

export const getAllChats = async (req: Request, res: Response) => {
  // get the logged in user id from the request object (set by the authentication middleware)
  const loggedInUserId = req.user?._id;
  if (!loggedInUserId) {
    throw new CustomError(
      'Unauthorized: User not logged in',
      StatusCodes.UNAUTHORIZED,
    );
  }

  // Use aggregation to get unique chat partner IDs efficiently
  const chatPartners = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      },
    },
    {
      $project: {
        chatPartnerId: {
          $cond: {
            if: { $eq: ['$senderId', loggedInUserId] },
            then: '$receiverId',
            else: '$senderId',
          },
        },
      },
    },
    { $group: { _id: '$chatPartnerId' } },
  ]);

  const uniqueChatUserIds = chatPartners.map((p) => p._id);

  const chats = await User.find({ _id: { $in: uniqueChatUserIds } }).select(
    '-password',
  );
  res.status(StatusCodes.OK).json(chats);
};
