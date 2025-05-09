import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:4000';

export interface ChatMessage {
  chatId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string | Date;
}

export const useChat = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const newSocket: Socket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('join', userId);

    newSocket.on('message', (message: ChatMessage) => {
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
