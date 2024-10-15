'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { setCookie } from 'cookies-next';
import { createUser } from '@/service/backend/api';
import { authenticate } from '@/service/auth';
import { Role } from '@/service/backend/domain/role';

export default function SignUpForm({ language }: { language: string }) {
  const { t } = useTranslation(language, 'signUp');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName')?.toString();
    const familyName = formData.get('familyName')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const role = formData.get('role')?.toString();

    createUser({ firstName, familyName, email, password, role }).then(
      async () => {
        const authenticationResult = await authenticate(email, password);
        if (!authenticationResult.valid && authenticationResult.errorMessage) {
          setErrorMessage(authenticationResult.errorMessage);
        }
        if (authenticationResult.valid) {
          setCookie(
            'access_token_music_manager',
            authenticationResult.accessToken,
          );
          window.location.href = '/';
        }
      },
    );
  };

  return (
    <div className="mx-auto min-w-[500px] max-w-md space-y-6 overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{t('form-title')}</h1>
        <p>{t('form-description')}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('first-name')}</Label>
            <Input
              className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
              id="firstName"
              name="firstName"
              placeholder={t('first-name-placeholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familyName">{t('family-name')}</Label>
            <Input
              className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
              id="familyName"
              name="familyName"
              placeholder={t('family-name-placeholder')}
              required
            />
          </div>
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="role">{t('select-role')}</Label>
          <select
            id="role"
            name="role"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm"
            required
          >
            <option value={Role.Musician}>{t('musician')}</option>
            <option value={Role.Client}>{t('client')}</option>
          </select>
        </div>
        <div className="flex justify-center pt-4">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            type="submit"
          >
            {t('sign-up-button')}
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
