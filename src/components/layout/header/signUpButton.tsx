'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';

const SignUpButton = ({ language }: { language: string }) => {
  const router = useRouter();
  const { t } = useTranslation(language, 'home');

  const signUp = () => {
    router.push('/sign-up');
  };

  return (
    <button onClick={signUp}>
      <div className="rounded-full border border-gray-100 px-4 py-2 font-bold text-[#23395b] hover:bg-gray-100">
        {t('sign-up')}
      </div>
    </button>
  );
};

export default SignUpButton;
