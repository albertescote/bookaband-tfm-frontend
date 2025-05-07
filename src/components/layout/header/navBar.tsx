'use client';
import { useTranslation } from '@/app/i18n/client';
import NavLink from '@/components/layout/header/navLink';

export default function Navbar({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');

  return (
    <nav className="flex flex-wrap items-center space-x-4 p-4">
      <NavLink
        href={`/${language}/artists`}
        label={t('search-musicians-tab')}
      />
      <NavLink href={`/${language}/providers`} label={t('providers-tab')} />
      <NavLink
        href={`/${language}/how-it-works`}
        label={t('how-it-works-tab')}
      />
      <NavLink href={`/${language}/about`} label={t('about-tab')} />
      <NavLink href={`/${language}/contact`} label={t('contact-tab')} />
    </nav>
  );
}
