'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { validateAccessToken } from '@/service/auth';

const LoginButton = ({ language }: { language: string }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(language, 'home');

  useEffect(() => {
    validateAccessToken().then((result) => {
      setAuthenticated(!!result);
    });
  }, []);
  const navigate = () => {
    if (!authenticated) {
      router.push('/login');
      return;
    }
    deleteCookie('access_token_music_manager');
    setAuthenticated(false);
    router.push('/');
  };
  return (
    <button onClick={navigate}>
      <div className="rounded-full border border-gray-100 px-4 py-2 font-bold text-[#23395b] hover:bg-gray-100">
        {authenticated ? t('sign-out') : t('sign-in')}
      </div>
    </button>
  );
};

export default LoginButton;
