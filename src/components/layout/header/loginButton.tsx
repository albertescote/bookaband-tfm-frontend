'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/service/backend/auth/service/auth.service';

const LoginButton = ({ language }: { language: string }) => {
  const { authentication, role, userBands } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(language, 'home');

  const navigate = () => {
    if (!authentication.isAuthenticated) {
      router.push('/login');
      return;
    }
    logout().then(() => {
      authentication.setAuthenticated(false);
      role.setRole('none');
      userBands.setUserBands([]);
      router.push('/');
    });
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
