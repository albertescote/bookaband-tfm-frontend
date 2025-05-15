'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck2, ChevronDown, LogOut, User } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';

export default function UserMenu({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-gray-100 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="hidden font-medium md:block">
            {user.firstName} {user.familyName}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
          />
        </div>
        <div className="relative">
          {getAvatar(42, 42, user.imageUrl, user.firstName)}
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        </div>
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-20 mt-3 w-60 origin-top-right rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 transition-all">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.familyName}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user.email || 'User'}
            </p>
          </div>

          <div className="flex flex-col gap-1 py-2">
            <Link
              href={`/${language}/bookings`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <CalendarCheck2 size={16} />
              {t('bookings-tab')}
            </Link>

            <Link
              href={`/${language}/profile`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <User size={16} />
              {t('profile-tab')}
            </Link>
          </div>

          <div className="border-t border-gray-100 py-2">
            <button
              onClick={() => {
                logoutUser();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-gray-50"
            >
              <LogOut size={16} />
              {t('sign-out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
