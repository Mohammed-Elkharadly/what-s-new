import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from '../types/users.types';

interface UserState {
  contacts: Contact[];
  selectedContact: Contact | null;
  onlineUsers: string[];
}

const initialState: UserState = {
  contacts: [],
  selectedContact: null,
  onlineUsers: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
  },
});

export const { setContacts, setSelectedContact, setOnlineUsers } =
  usersSlice.actions;
export default usersSlice.reducer;
