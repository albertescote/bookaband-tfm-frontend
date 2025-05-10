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

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-3 rounded-full py-2 pl-2 transition-colors duration-200 hover:bg-gray-100"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2 text-[#565d6d]">
          <span className="hidden text-base font-medium  md:block">
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
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.familyName}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user.email || 'User'}
            </p>
          </div>

          <div className="py-1">
            <Link
              href={`/${language}/bookings`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CalendarCheck2 size={16} />
              <span>{t('bookings-tab')}</span>
            </Link>

            <Link
              href={`/${language}/profile`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User size={16} />
              <span>{t('profile-tab')}</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={logoutUser}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut size={16} />
              <span>{t('sign-out')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
