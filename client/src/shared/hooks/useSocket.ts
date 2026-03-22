import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setOnlineUsers } from '../../features/users/slices/usersSlice';
import {
  addMessage,
  markMessagesAsRead,
} from '../../features/messages/slices/messageSlice';
import socket from '../socket';
import type { Message } from '../../features/messages/types/message.types';

const useSocket = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // connect and tell the server who we are
    socket.connect();
    socket.emit('users:online', user._id);

    // listen for online users update
    socket.on('users:online', (userId: string[]) => {
      dispatch(setOnlineUsers(userId));
    });

    // listen for new message
    socket.on('message:new', (message: Message) => {
      dispatch(addMessage(message));
    });

    socket.on('messages:read', () => {
      dispatch(markMessagesAsRead());
    });

    return () => {
      socket.off('users:online');
      socket.off('message:new');
      socket.disconnect();
    };
  }, [isAuthenticated, user, dispatch]);
};

export default useSocket;
