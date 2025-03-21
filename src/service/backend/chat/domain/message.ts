export interface MessagePrimitives {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp?: string | Date;
}
