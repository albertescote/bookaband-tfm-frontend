'use client';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { SelectBand } from '@/components/chat/selectBand';
import { ChatsList } from '@/components/chat/chatsList';

export function ChatMenu({
  language,
  userId,
}: {
  language: string;
  userId?: string;
}) {
  const { role } = useAuth();

  return (
    <div>
      {role.role === Role.Musician ? (
        <SelectBand language={language}></SelectBand>
      ) : (
        <ChatsList language={language} userId={userId}></ChatsList>
      )}
    </div>
  );
}
