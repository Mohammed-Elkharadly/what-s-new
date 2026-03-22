export interface Message {
  _id: string;
  senderId: string;
  content?: string;
  image?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
