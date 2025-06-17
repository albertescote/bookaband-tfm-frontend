import { getClientChats } from '@/service/backend/chat/service/chat.service';
import { ChatLayout } from '@/components/chats/chatLayout';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import Error from '@/components/shared/error';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { t } = await getTranslation(lng, 'chat');

  const chatId = resolvedSearchParams?.chat_id;
  const bandId = resolvedSearchParams?.band_id;

  const user = await getUserInfo();
  if (!user) {
    return <div>Error</div>;
  }
  const chats = await getClientChats(user.id);

  if ('error' in chats) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <ChatLayout language={lng} chats={chats} chatId={chatId} bandId={bandId} />
  );
}
