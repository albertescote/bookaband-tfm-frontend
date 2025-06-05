import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BookingStatus } from '@/service/backend/booking/domain/booking';

const SOCKET_SERVER_URL = 'http://localhost:4000';

export interface SocketMessage {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string | Date;
  metadata?: {
    bookingId?: string;
    bookingStatus?: BookingStatus;
    eventName?: string;
    eventDate?: string;
    venue?: string;
    city?: string;
  };
}

export const useChat = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<SocketMessage[]>([]);

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
    message: string,
  ) => {
    if (socket) {
      socket.emit('message', {
        chatId,
        senderId: userId,
        recipientId,
        message,
      });
    }
  };

  return { messages, sendMessage };
};
