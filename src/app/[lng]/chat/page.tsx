import { ChatMenu } from '@/components/chat/chatMenu';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full min-w-[90vh] max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        <ChatMenu language={lng}></ChatMenu>
      </div>
    </div>
  );
}
