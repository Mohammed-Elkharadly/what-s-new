import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from '../features/messages/api/messageApi';
import { setMessages } from '../features/messages/slices/messageSlice';

const ChatPage = () => {
  const [content, setContent] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { selectedContact, onlineUsers } = useAppSelector(
    (state) => state.users,
  );
  const { messages } = useAppSelector((state) => state.messages);

  const { data } = useGetMessagesQuery(selectedContact?._id ?? '', {
    skip: !selectedContact,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  // sync message from api to redux store
  useEffect(() => {
    if (data?.messages) {
      dispatch(setMessages(data.messages));
    }
  }, [data, dispatch]);

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // mark as read when contact is selected or new message arrives
  useEffect(() => {
    if (selectedContact) {
      markAsRead(selectedContact._id);
    }
  }, [messages, selectedContact]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedContact]);

  const handleSend = async () => {
    if (!content.trim() || !selectedContact) return;
    try {
      await sendMessage({
        receiverId: selectedContact._id,
        content,
        timestamp: Date.now(),
      });
      setContent('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  // format time from ISO string
  const formatTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!selectedContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-base-content/50">
        <span className="text-6x1">💬</span>
        <p className="text-lg">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col h-screen">
        {/** Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-400 bg-base-100">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
              {selectedContact.avatar ? (
                <img src={selectedContact.avatar} alt={selectedContact.name} />
              ) : (
                <span>{selectedContact.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold">{selectedContact.name}</p>
            <p className="text-xs text-base-content/50">
              {selectedContact.email}
            </p>
          </div>
        </div>
        {/** Message*/}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-center text-base-content/50 text-sm mt-4">
              No message yet. Say hello! 👋
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm relative
                    ${
                      isMe
                        ? 'bg-green-700 text-primary-content rounded-br-none'
                        : 'bg-base-300 text-base-content rounded-bl-none'
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    <p
                      className={`text-xs mt-1 ${isMe ? 'text-primary-content/70' : 'text-base-content/50'}`}
                    >
                      {formatTime.format(new Date(msg.createdAt))}
                    </p>
                    {isMe && (
                      <span
                        className={`text-base absolute bottom-0 right-0
                          ${
                            msg.isRead
                              ? 'text-blue-500'
                              : onlineUsers.includes(selectedContact._id)
                                ? 'text-gray-200'
                                : 'text-gray-200'
                          }`}
                      >
                        {!onlineUsers.includes(selectedContact._id)
                          ? '✓'
                          : '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} aria-label="refer"></div>
        </div>
        {/** Input */}
        <div className="px-4 py-3 border-t border-base-300 bg-base-100 flex items-center gap-2">
          <label htmlFor="message" aria-label="inpu message label"></label>
          <input
            type="text"
            id="message"
            ref={inputRef}
            className="input input-bordered flex-1 input-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleSend}
            className="btn btn-primary btn-sm"
            disabled={isSending || !content.trim()}
          >
            {isSending ? (
              <span
                className="loading loading-spinner loading-xs"
                aria-label="spinner"
              ></span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
