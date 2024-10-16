'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { useAuth } from '@/providers/AuthProvider';

const LoginButton = ({ language }: { language: string }) => {
  const { authentication } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(language, 'home');

  const navigate = () => {
    if (!authentication.isAuthenticated) {
      router.push('/login');
      return;
    }
    deleteCookie('access_token_music_manager');
    authentication.setAuthenticated(false);
    router.push('/');
  };
  return (
    <button onClick={navigate}>
      <div className="rounded-full border border-gray-100 px-4 py-2 font-bold text-[#23395b] hover:bg-gray-100">
        {authentication.isAuthenticated ? t('sign-out') : t('sign-in')}
      </div>
    </button>
  );
};

export default LoginButton;
