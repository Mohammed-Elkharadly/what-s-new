import { Schema, model, Types, type HydratedDocument } from 'mongoose';

interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  isRead: boolean;
  content: string;
  image: string;
}

export type MessageDocument = HydratedDocument<IMessage>;

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
      maxLength: 2000,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export const Message = model<IMessage>('Message', messageSchema);
