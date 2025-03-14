import { MessagePrimitives } from '@/service/backend/domain/message';

export interface ChatPrimitives {
  id: string;
  userId: string;
  bandId: string;
  messages: MessagePrimitives[];
}
