'use client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { FormEvent, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { authenticate } from '@/service/backend/auth/service/auth.service';
import { useRouter } from 'next/navigation';

export default function LoginForm({
  language,
  redirectTo,
}: {
  language: string;
  redirectTo?: string;
}) {
  const { t } = useTranslation(language, 'login');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    authenticate(email, password).then((authenticationResult) => {
      if (!authenticationResult.valid && authenticationResult.errorMessage) {
        setErrorMessage(authenticationResult.errorMessage);
      }
      if (authenticationResult.valid) {
        const redirectUrl = redirectTo ? decodeURIComponent(redirectTo) : '/';
        router.push(redirectUrl);
      }
    });
  };

  return (
    <div className="mx-auto min-w-[500px] max-w-md space-y-6 overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{t('form-title')}</h1>
        <p>{t('form-description')}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="email"
            name="email"
            placeholder={t('email-placeholder')}
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="password"
            name="password"
            placeholder={t('password-placeholder')}
            required
            type="password"
            minLength={8}
          />
        </div>
        <div className="flex justify-center pt-4">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            type="submit"
          >
            {t('sign-in-button')}
          </button>
        </div>
      </form>
      <div
        className="flex h-8 items-end justify-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <p className="text-center text-lg text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
