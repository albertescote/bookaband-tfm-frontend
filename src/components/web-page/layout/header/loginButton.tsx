'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { LoginIcon } from '@heroicons/react/outline';

const LoginButton = ({ language }: { language: string }) => {
  const router = useRouter();
  const { t } = useTranslation(language, 'home');

  const loginUser = () => {
    router.push(`/${language}/login`);
  };
  return (
    <button
      onClick={loginUser}
      className="flex items-center gap-2 rounded-xl border-[1px] border-[#15b7b9] px-4 py-2 text-sm text-[#15b7b9] transition hover:bg-[#15b7b9] hover:text-white hover:shadow-lg"
    >
      <LoginIcon
        width={20}
        height={20}
        className="scale-x-[-1] transform"
      ></LoginIcon>
      {t('sign-in')}
    </button>
  );
};

export default LoginButton;
