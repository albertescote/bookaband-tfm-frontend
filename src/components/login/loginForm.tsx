'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/service/backend/auth/service/auth.service';
import { useTranslation } from '@/app/i18n/client';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { ArrowLeft } from 'lucide-react';

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
      if (!authenticationResult.valid) {
        setErrorMessage(authenticationResult.errorMessage || '');
        return;
      }
      const redirectUrl = redirectTo ? decodeURIComponent(redirectTo) : '/';
      router.push(redirectUrl);
    });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/login-background2.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="mb-6 text-center text-2xl font-bold">
          {t('form-title')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              {t('email')}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t('email-placeholder')}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {t('password')}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t('password-placeholder')}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#15b7b9] px-4 py-2 font-semibold text-white transition hover:bg-[#109ea1]"
          >
            {t('sign-in-button')}
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
