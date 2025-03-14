'use client';
import React, { useEffect, useState } from 'react';
import { ChatMessage, useChat } from '@/hooks/useSocket';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { ChatView } from '@/service/backend/domain/chatView';

interface ChatProps {
  language: string;
  chat: ChatView;
}

const Chat: React.FC<ChatProps> = ({ chat }) => {
  const { role } = useAuth();
  const senderId = role.role === Role.Client ? chat.user.id : chat.band.id;
  const recipientId = role.role === Role.Client ? chat.band.id : chat.user.id;

  const { messages, sendMessage } = useChat(senderId);
  const [message, setMessage] = useState<string>('');

  const [allMessages, setAllMessages] = useState<ChatMessage[]>(
    chat.messages.map((msg) => ({
      chatId: msg.id,
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      message: msg.content,
    })),
  );

  useEffect(() => {
    setAllMessages((prevMessages) => [...prevMessages, ...messages]);
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        chatId: chat.id,
        senderId,
        recipientId,
        message,
      };
      setAllMessages((prev) => [...prev, newMessage]);

      sendMessage(chat.id, recipientId, message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="mx-auto flex h-screen min-w-[90vh] flex-col rounded-xl border bg-white shadow-lg">
      <div className="rounded-t-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-lg font-semibold text-white">
        <div className="flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-gray-300" />{' '}
          <span className="text-xl">
            {role.role === Role.Client
              ? chat.band.name
              : `${chat.user.firstName} ${chat.user.familyName}`}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {allMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          allMessages.map((chatMessage, index) => (
            <div
              key={index}
              className={`max-w-xs rounded-lg p-3 ${
                chatMessage.senderId === senderId
                  ? 'ml-auto self-end bg-indigo-500 text-white'
                  : 'self-start bg-gray-200 text-gray-800'
              }`}
            >
              {chatMessage.message}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center border-t bg-gray-50 p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 rounded-full bg-indigo-500 p-3 text-white transition-all duration-200 hover:bg-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
