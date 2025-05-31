'use client';

import { useAuth } from '@/providers/authProvider';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { Menu } from 'lucide-react';
import React from 'react';
import { BandSwitcher } from '@/components/layout/header/band-switcher';
import { NotificationDropdown } from './notification-dropdown';
import { UserBand } from '@/service/backend/band/domain/userBand';

export default function Header() {
  const { user, userBands } = useAuth();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'home');

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {t('welcome')}, {user?.firstName}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BandSwitcher bands={userBands || []} />
        <NotificationDropdown />
      </div>
    </header>
  );
}
