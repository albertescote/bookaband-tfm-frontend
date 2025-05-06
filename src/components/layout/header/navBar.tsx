'use client';
import { useTranslation } from '@/app/i18n/client';
import NavLink from '@/components/layout/header/navLink';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';

export default function Navbar({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const { user } = useWebPageAuth();

  return (
    <nav className="flex space-x-4 p-4">
      <NavLink href={`/${language}/`} label={t('home-tab')} />
      <NavLink href={`/${language}/artists`} label={t('artists-tab')} />
      <NavLink href={`/${language}/events`} label={t('events-tab')} />
      {!!user && (
        <div className="flex">
          <NavLink href={`/${language}/`} label={t('home-tab')} />
          <NavLink href={`/${language}/chat`} label={t('chat-tab')} />
          <NavLink href={`/${language}/booking`} label={t('bookings-tab')} />
          <NavLink href={`/${language}/profile`} label={t('profile-tab')} />
        </div>
      )}
    </nav>
  );
}
