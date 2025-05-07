'use client';
import { useTranslation } from '@/app/i18n/client';
import NavLink from '@/components/layout/header/navLink';

export default function Navbar({
  language,
  onLinkClick,
}: {
  language: string;
  onLinkClick?: () => void;
}) {
  const { t } = useTranslation(language, 'home');

  return (
    <nav className="flex flex-col items-center space-y-4 text-center lg:flex-row lg:space-x-6 lg:space-y-0">
      <NavLink
        href={`/${language}/artists`}
        label={t('search-musicians-tab')}
        onClick={onLinkClick}
      />
      <NavLink
        href={`/${language}/providers`}
        label={t('providers-tab')}
        onClick={onLinkClick}
      />
      <NavLink
        href={`/${language}/how-it-works`}
        label={t('how-it-works-tab')}
        onClick={onLinkClick}
      />
      <NavLink
        href={`/${language}/about`}
        label={t('about-tab')}
        onClick={onLinkClick}
      />
      <NavLink
        href={`/${language}/contact`}
        label={t('contact-tab')}
        onClick={onLinkClick}
      />
    </nav>
  );
}
