'use client';
import { useTranslation } from '@/app/i18n/client';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { AUTH_URL } from '@/publicConfig';

const SignUpButton = ({ language }: { language: string }) => {
  const { t } = useTranslation(language, 'home');

  const signUp = () => {
    window.location.href = `${AUTH_URL}/${language}/sign-up`;
  };

  return (
    <button
      onClick={signUp}
      className="flex items-center gap-2 rounded-xl bg-[#15b7b9] px-4 py-2 text-sm text-white transition hover:bg-[#f3f4f6] hover:text-[#15b7b9] hover:shadow-lg"
    >
      <PlusCircleIcon width={20} height={20}></PlusCircleIcon>
      {t('sign-up')}
    </button>
  );
};

export default SignUpButton;
