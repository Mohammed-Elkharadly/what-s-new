import { apiSlice } from '../../../shared/api/apiSlice';
import { setMessages, addMessage } from '../slices/messageSlice';
import type { Message } from '../types/message.types';

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<{ messages: Message[] }, string>({
      query: (userId) => `/messages/${userId}`,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(setMessages(data.messages));
        } catch (error) {
          console.error('Faild to fetch messages', error);
        }
      },
    }),
    sendMessage: builder.mutation<
      { message: Message },
      {
        receiverId: string;
        content?: string;
        image?: string;
        timestamp?: number;
      }
    >({
      query: ({ receiverId, timestamp, ...body }) => ({
        url: `/messages/send/${receiverId}`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(addMessage(data.message));
        } catch (error) {
          console.error('Failed to send message');
        }
      },
    }),
    markAsRead: builder.mutation<{ message: string }, string>({
      query: (senderId) => ({
        url: `/messages/read/${senderId}`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = messageApi;
