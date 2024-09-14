'use client';
import { useTranslation } from '@/app/i18n/client';
import { useFormStatus } from 'react-dom';

const DoLoginButton = ({ language }: { language: string }) => {
  const { pending } = useFormStatus();
  const { t } = useTranslation(language, 'home');
  return (
    <button aria-disabled={pending} type={'submit'}>
      <div className="rounded-full border border-gray-100 px-4 py-2 font-bold text-[#23395b] hover:bg-gray-100">
        {t('sign-in')}
      </div>
    </button>
  );
};

export default DoLoginButton;
