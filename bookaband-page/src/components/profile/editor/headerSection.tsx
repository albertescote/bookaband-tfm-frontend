'use client';

import { CalendarDays } from 'lucide-react';
import React from 'react';
import { getAvatar } from '@/components/shared/avatar';

interface HeaderSectionProps {
  fullName: string;
  imageUrl?: string;
  joinedDate: string;
  bio?: string;
}

export default function HeaderSection({
  fullName,
  imageUrl,
  joinedDate,
  bio,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-r from-[#f0faff] to-[#e0f7fa] p-6 shadow-md transition-all">
      {getAvatar(80, 80, imageUrl, fullName)}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">{fullName}</h1>
        {bio && <p className="mt-1 text-sm text-gray-600">{bio}</p>}
        <div className="mt-2 flex flex-col text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-[#15b7b9]" />
            <span>Joined: {joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
