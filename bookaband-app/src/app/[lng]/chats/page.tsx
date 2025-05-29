import { ChatLayout } from '@/components/chats/chatLayout';

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

  return <ChatLayout language={lng} chatId={chatId} />;
}
