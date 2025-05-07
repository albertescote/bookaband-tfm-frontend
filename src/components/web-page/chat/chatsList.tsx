'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import {
  getBandChats,
  getClientChats,
} from '@/service/backend/chat/service/chat.service';
import { getAvatar } from '@/components/shared/avatar';

export function ChatsList({
  language,
  bandOptions,
  userId,
}: {
  language: string;
  userId?: string;
  bandOptions?: {
    id: string;
    setBandId: Dispatch<SetStateAction<string | undefined>>;
    multiple: boolean;
  };
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
        if (bandOptions?.id) {
          chatsView = await getBandChats(bandOptions.id);
        } else if (userId) {
          chatsView = await getClientChats(userId);
        }
        setChats(chatsView || []);
      } catch (err) {
        setError('Failed to load chats.');
      } finally {
        setLoading(false);
      }
    }
    fetchChats().then();
  }, [bandOptions?.id, userId]);

  if (loading)
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex">
        {!!bandOptions?.id && bandOptions.multiple && (
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => {
              bandOptions.setBandId(undefined);
            }}
          />
        )}
        <h2 className="ml-4 text-lg font-semibold">{t('your-chats')}</h2>
      </div>
      {chats.length === 0 ? (
        <p className="text-center text-gray-500">{t('no-chats-available')}</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {chats.map((chat, index) => (
            <li
              key={index}
              className="relative flex items-center rounded-md p-4 transition hover:cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/${language}/chat/${chat.id}`)}
            >
              {getAvatar(
                64,
                64,
                userId ? chat.band?.imageUrl : chat.user?.imageUrl,
                userId
                  ? chat.band?.name || 'Unknown'
                  : `${chat.user?.firstName || ''} ${chat.user?.familyName || ''}`.trim(),
              )}
              <div className="ml-6 flex-1">
                <strong className="block text-gray-800">
                  {userId
                    ? chat.band?.name
                    : `${chat.user?.firstName} ${chat.user?.familyName}`}
                </strong>
                <p className="mt-2 text-sm text-gray-600">
                  {chat.messages?.length > 0
                    ? chat.messages[chat.messages.length - 1].content
                    : '...'}
                </p>
              </div>
              {chat.unreadMessagesCount > 0 && (
                <span className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {chat.unreadMessagesCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
