import Chat from '@/components/chats/chat';
import { getChatById } from '@/service/backend/chat/service/chat.service';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const chatId = searchParams?.chat_id;
  let initialChat: any = undefined;

  if (chatId) {
    try {
      initialChat = await getChatById(chatId);
    } catch (error) {
      console.error('Error fetching chat:', error);
      initialChat = undefined;
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] -m-6">
      <Chat language={lng} chatId={chatId} initialChat={initialChat} />
    </div>
  );
}
