'use client';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import { validateAccessToken } from '@/service/auth';
import NavLink from '@/components/layout/header/navLink';
import { Role } from '@/service/backend/domain/role';

export default function Navbar({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState('none');

  useEffect(() => {
    validateAccessToken().then((result) => {
      setAuthenticated(!!result);
      if (result?.role) {
        setRole(result.role);
      }
    });
  }, []);

  return (
    <nav className="flex space-x-4 p-4">
      {authenticated && (
        <div className="flex">
          <NavLink href={`/`} label={t('home-tab')} />
          {role === Role.Musician && (
            <NavLink href={`/manage-offers`} label={t('manage-offers-tab')} />
          )}
          <NavLink href={`/profile`} label={t('profile-tab')} />
        </div>
      )}
    </nav>
  );
}
