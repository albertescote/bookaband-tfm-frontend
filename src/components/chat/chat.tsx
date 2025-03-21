'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, useChat } from '@/hooks/useSocket';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/user/domain/role';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import { createNewChat } from '@/service/backend/chat/service/chat.service';

interface ChatProps {
  language: string;
  chat: ChatHistory;
}

const Chat: React.FC<ChatProps> = ({ language, chat }) => {
  const { t } = useTranslation(language, 'chat');
  const { role } = useAuth();
  const router = useRouter();
  const senderId = role.role === Role.Client ? chat.user.id : chat.band.id;
  const recipientId = role.role === Role.Client ? chat.band.id : chat.user.id;

  const { messages, sendMessage } = useChat(senderId);
  const [message, setMessage] = useState<string>('');

  const [allMessages, setAllMessages] = useState<ChatMessage[]>(
    chat.messages.map((msg) => ({
      chatId: chat.id,
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      message: msg.content,
    })),
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAllMessages((prevMessages) => [...prevMessages, ...messages]);
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (allMessages.length === 0) {
        createNewChat(chat.band.id).then((chatId) => {
          if (chatId) {
            chat.id = chatId;
          }
          const newMessage: ChatMessage = {
            chatId: chat.id,
            senderId,
            recipientId,
            message,
          };
          setAllMessages((prev) => [...prev, newMessage]);

          sendMessage(chat.id, recipientId, message);
          setMessage('');
        });
      } else {
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : '?';

  const getRandomColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const getAvatar = (chat: ChatHistory) => {
    const imageUrl =
      role.role === Role.Client ? chat.band?.imageUrl : chat.user?.imageUrl;
    const displayName =
      role.role === Role.Client
        ? chat.band?.name || 'Unknown'
        : `${chat.user?.firstName || ''} ${chat.user?.familyName || ''}`.trim();

    return imageUrl ? (
      <img
        src={imageUrl}
        alt={displayName}
        className="mr-4 h-16 w-16 rounded-full object-cover"
      />
    ) : (
      <div
        className="mr-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ backgroundColor: getRandomColor(displayName) }}
      >
        {getInitial(displayName)}
      </div>
    );
  };

  return (
    <div className="mx-auto flex h-[75vh] min-w-[90vh] flex-col rounded-xl border bg-white shadow-lg">
      <div className="rounded-t-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-lg font-semibold text-white">
        <div className="flex items-center">
          <button
            onClick={() => {
              router.back();
              router.refresh();
            }}
            className="mr-4 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          {getAvatar(chat)}
          <span className="text-xl">
            {role.role === Role.Client
              ? chat.band.name
              : `${chat.user.firstName} ${chat.user.familyName}`}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {allMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500">{t('no-messages-yet')}</p>
          </div>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center rounded-b-xl border-t bg-gray-50 p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t('type-a-message')}
          className="flex-1 rounded-full border border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 rounded-full bg-indigo-500 p-3 text-white transition-all duration-200 hover:bg-indigo-600"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
