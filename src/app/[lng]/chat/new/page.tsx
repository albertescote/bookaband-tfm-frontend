import Chat from '@/components/chat/chat';
import { ChatView } from '@/service/backend/domain/chatView';
import { getBandViewById, getUserInfo } from '@/service/backend/api';
import { randomUUID } from 'node:crypto';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ChatPage({
  params: { lng },
  searchParams,
}: PageParams) {
  const userInfo = await getUserInfo();
  const bandId = searchParams?.band_id as string | undefined;
  let band;
  if (bandId) {
    band = await getBandViewById(bandId);
  }
  if (userInfo && band) {
    console.log('hola');
    const newChat: ChatView = {
      id: randomUUID(),
      createdAt: new Date(),
      messages: [],
      user: userInfo,
      band: band,
    };
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
        <Chat language={lng} chat={newChat}></Chat>
      </div>
    );
  }
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <p>Error</p>
    </div>
  );
}
