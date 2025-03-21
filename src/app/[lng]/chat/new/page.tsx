import Chat from '@/components/chat/chat';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { randomUUID } from 'node:crypto';

import { getUserInfo } from '@/service/backend/user/service/user.service';
import { getBandViewById } from '@/service/backend/band/service/band.service';

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
    const now = new Date();
    const newChat: ChatView = {
      id: randomUUID(),
      createdAt: now,
      messages: [],
      user: userInfo,
      band: band,
      unreadMessagesCount: 0,
      updatedAt: now,
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
