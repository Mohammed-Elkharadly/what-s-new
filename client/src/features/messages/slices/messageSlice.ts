import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../types/message.types';

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    markMessagesAsRead: (state) => {
      state.messages = state.messages.map((msg) => ({
        ...msg,
        isRead: true
      }));
    },
  },
});

export const { setMessages, addMessage, clearMessages, markMessagesAsRead } = messageSlice.actions;
export default messageSlice.reducer;
