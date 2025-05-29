import { getBandChats } from '@/service/backend/chat/service/chat.service';
import { ChatLayout } from '@/components/chats/chatLayout';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import Error from '@/components/shared/error';
import { getTranslation } from '@/app/i18n';

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
  const { t } = await getTranslation(lng, 'profile');

  const chatId = searchParams?.chat_id;
  const bandId = searchParams?.band_id;

  const user = await getUserInfo();
  if (!user) {
    return <div>Error</div>;
  }
  const chats = await getBandChats(user.id);

  if (!chats || 'error' in chats) {
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
