import Chat from '@/components/chat/chat';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function ChatPage({
  params: { lng },
  searchParams,
}: PageParams) {
  const bandId = searchParams?.band_id;
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <Chat language={lng} bandId={bandId}></Chat>
    </div>
  );
}
