'use client';
import NavLink from '@/components/ui/navLink';
import { useTranslation } from '@/app/i18n/client';

export default function Navbar({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  return (
    <nav className="flex space-x-4 p-4">
      <NavLink href={`/home`} label={t('home-tab')} />
      <NavLink href={`/`} label={t('contact-tab')} />
    </nav>
  );
}
