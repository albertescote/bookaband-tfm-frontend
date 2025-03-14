'use client';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { SelectBand } from '@/components/chat/selectBand';

export function ChatMenu({ language }: { language: string }) {
  const { role } = useAuth();

  return (
    <div>
      {role.role === Role.Musician ? (
        <SelectBand language={language}></SelectBand>
      ) : (
        <div></div>
      )}
    </div>
  );
}
