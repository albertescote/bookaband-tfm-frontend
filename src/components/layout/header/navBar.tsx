'use client';
import { useTranslation } from '@/app/i18n/client';
import NavLink from '@/components/layout/header/navLink';
import { Role } from '@/service/backend/domain/role';
import { useAuth } from '@/providers/AuthProvider';

export default function Navbar({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const { authentication, role } = useAuth();

  return (
    <nav className="flex space-x-4 p-4">
      {authentication.isAuthenticated && (
        <div className="flex">
          <NavLink href={`/`} label={t('home-tab')} />
          {role.role === Role.Musician && (
            <NavLink href={`/manage-offers`} label={t('manage-offers-tab')} />
          )}
          <NavLink href={`/profile`} label={t('profile-tab')} />
        </div>
      )}
    </nav>
  );
}
