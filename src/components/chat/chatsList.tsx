import React, { useEffect, useState } from 'react';
import { getBandChats, getUserChats } from '@/service/backend/api';
import { ChatView } from '@/service/backend/domain/chatView';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

export function ChatsList({
  language,
  bandId,
  userId,
}: {
  language: string;
  bandId?: string;
  userId?: string;
}) {
  const { t } = useTranslation(language, 'chat');
  const [chats, setChats] = useState<ChatView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchChats() {
      try {
        setLoading(true);
        let chatsView: ChatView[] | undefined = [];
        if (bandId) {
          chatsView = await getBandChats(bandId);
        } else if (userId) {
          chatsView = await getUserChats(userId);
        }
        setChats(chatsView || []);
      } catch (err) {
        setError('Failed to load chats.');
      } finally {
        setLoading(false);
      }
    }
    fetchChats().then();
  }, [bandId, userId]);

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : '?';

  const getRandomColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const getAvatar = (chat: ChatView) => {
    const imageUrl = userId ? chat.band?.imageUrl : chat.user?.imageUrl;
    const displayName = userId
      ? chat.band?.name || 'Unknown'
      : `${chat.user?.firstName || ''} ${chat.user?.familyName || ''}`.trim();
    console.log(displayName);

    return imageUrl ? (
      <img
        src={imageUrl}
        alt={displayName}
        className="mr-4 h-16 w-16 rounded-full object-cover"
      />
    ) : (
      <div
        className="mr-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ backgroundColor: getRandomColor(displayName) }}
      >
        {getInitial(displayName)}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">{t('your-chats')}</h2>
      {chats.length === 0 ? (
        <p className="text-center text-gray-500">{t('no-chats-available')}</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {chats.map((chat, index) => (
            <li
              key={index}
              className="rounded-md p-4 transition hover:cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              <div className="flex">
                {getAvatar(chat)}
                <div>
                  <strong className="block text-gray-800">
                    {userId
                      ? chat.band.name
                      : chat.user.firstName + ' ' + chat.user.familyName}
                  </strong>
                  <p className="mt-2 text-sm text-gray-600">
                    {chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content
                      : '...'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
