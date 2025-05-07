'use client';

import { useWebAppAuth } from '@/providers/webAppAuthProvider';
import { LogOut } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';
import LanguageSwitcher from './language-switcher';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

export default function Sidebar() {
  const { user, logoutUser } = useWebAppAuth();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'web-app');

  return (
    <aside className="hidden w-64 flex-col border-r bg-white shadow-md md:flex">
      <div className="p-6 text-2xl font-extrabold text-[#15b7b9]">
        BookaBand
      </div>
      <nav className="flex-1 space-y-2 px-4">
        <NavItem href="/dashboard" label={t('dashboard')} />
        <NavItem href="/calendar" label={t('calendar')} />
        <NavItem href="/bands" label={t('bands')} />
        <NavItem href="/performances" label={t('performances')} />
        <NavItem href="/payments" label={t('payments')} />
        <NavItem href="/profile" label={t('profile-tab')} />
      </nav>
      <div className="space-y-4 border-t p-4">
        <div className="flex items-center space-x-3 px-3">
          {getAvatar(28, 28, user?.imageUrl, user?.firstName)}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.firstName} {user?.familyName}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-1">
          <LanguageSwitcher language={language} />
          <button 
            onClick={logoutUser}
            className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
    >
      {label}
    </a>
  );
}
