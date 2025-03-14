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
    <div className="mx-auto flex h-screen max-w-2xl flex-col rounded-lg border bg-white shadow-md">
      <div className="bg-gray-800 p-4 text-lg font-semibold text-white">
        Chat with{' '}
        {role.role === Role.Client
          ? chat.band.name
          : chat.user.firstName + ' ' + chat.user.familyName}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {allMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          allMessages.map((chatMessage, index) => (
            <div
              key={index}
              className={`max-w-xs rounded-lg p-2 ${
                chatMessage.senderId === senderId
                  ? 'ml-auto self-end bg-blue-500 text-white'
                  : 'self-start bg-gray-200 text-gray-800'
              }`}
            >
              {chatMessage.message}
            </div>
          ))
        )}
      </div>
      <div className="flex items-center border-t p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
