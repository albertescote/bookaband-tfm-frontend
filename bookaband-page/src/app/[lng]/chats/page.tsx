import { getClientChats } from '@/service/backend/chat/service/chat.service';
import { ChatLayout } from '@/components/chats/chatLayout';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { BackendError } from '@/service/backend/shared/domain/backendError';

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
  const bandId = searchParams?.band_id;

  const user = await getUserInfo();
  if (!user) {
    return <div>Error</div>;
  }
  const chats = await getClientChats(user.id);

  if ('error' in chats) {
    const backendError = chats as BackendError;
    return <div>{backendError.error}</div>;
  }

  return (
    <ChatLayout language={lng} chats={chats} chatId={chatId} bandId={bandId} />
  );
}
