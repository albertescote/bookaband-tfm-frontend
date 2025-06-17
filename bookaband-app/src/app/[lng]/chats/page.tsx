import Chat from '@/components/chats/chat';
import { getChatById } from '@/service/backend/chat/service/chat.service';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const chatId = resolvedSearchParams?.chat_id;
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
    <div className="-m-6 min-h-[calc(100vh-4rem)]">
      <Chat language={lng} chatId={chatId} initialChat={initialChat} />
    </div>
  );
}
