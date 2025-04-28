import Chat from '@/components/chat/chat';

interface PageParams {
  params: {
    lng: string;
    chatId: string;
  };
}

export default async function ChatPage({
  params: { lng, chatId },
}: PageParams) {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <Chat language={lng} chatId={chatId}></Chat>
    </div>
  );
}
