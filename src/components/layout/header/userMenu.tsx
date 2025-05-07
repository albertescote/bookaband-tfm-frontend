'use client';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck2, LogOut, User } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';

export default function UserMenu({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const { user, logoutUser } = useWebPageAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center`}
      >
        <p
          className={`pr-4 text-base text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]`}
        >
          {user.firstName} {user.familyName}
        </p>
        {getAvatar(36, 36, user.imageUrl, user.firstName)}
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#15b7b9] bg-white shadow-xl">
          <Link
            href={`/${language}/bookings`}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 transition hover:bg-[#15b7b9]/10"
          >
            <CalendarCheck2 size={18} />
            {t('bookings-tab')}
          </Link>
          <Link
            href={`/${language}/profile`}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 transition hover:bg-[#15b7b9]/10"
          >
            <User size={18} />
            {t('profile-tab')}
          </Link>
          <button
            onClick={logoutUser}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[#15b7b9] transition hover:bg-[#15b7b9]/10"
          >
            <LogOut size={18} />
            {t('sign-out')}
          </button>
        </div>
      )}
    </div>
  );
}
