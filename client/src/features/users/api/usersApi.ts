import { apiSlice } from '../../../shared/api/apiSlice';
import { setContacts } from '../slices/usersSlice';
import type { Contact } from '../types/users.types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<{ contacts: Contact[] }, void>({
      query: () => '/messages/contacts',
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setContacts(data.contacts));
        } catch (error) {
          console.error('Failed to fetch contacts');
        }
      },
    }),
  }),
});

export const { useGetContactsQuery} = usersApi;