import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BookingMetadata } from '@/service/backend/chat/domain/message';

const SOCKET_SERVER_URL = 'http://localhost:4000';

export interface ChatMessage {
  chatId: string;
  senderId: string;
  recipientId: string;
  message?: string;
  fileUrl?: string;
  timestamp: string | Date;
  bookingMetadata?: BookingMetadata;
}

export interface SocketMessage {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  timestamp: string | Date;
  message?: string;
  fileUrl?: string;
  bookingMetadata?: BookingMetadata;
}

export const useChat = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('join', userId);

    newSocket.on('message', (message: SocketMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendMessage = (
    chatId: string,
    recipientId: string,
    message?: string,
    fileUrl?: string,
  ) => {
    if (socket) {
      socket.emit('message', {
        chatId,
        senderId: userId,
        recipientId,
        message,
        fileUrl,
      });
    }
  };

  return { messages, sendMessage };
};
