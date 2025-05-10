import { MessagePrimitives } from '@/service/backend/chat/domain/message';

export interface ChatPrimitives {
  id: string;
  userId: string;
  bandId: string;
  messages: MessagePrimitives[];
}
