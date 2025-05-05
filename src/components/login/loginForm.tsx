'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  authenticate,
  getLoginWithGoogleUrl,
} from '@/service/backend/auth/service/auth.service';
import { useTranslation } from '@/app/i18n/client';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function LoginForm({
  language,
  error,
}: {
  language: string;
  error?: string;
}) {
  const { t } = useTranslation(language, 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error === 'error-server') {
        toast.error(t('error-server'));
      } else if (error == 'missing-code') {
        toast.error(t('missing-code'));
      } else {
        toast.error(decodeURIComponent(error));
      }
    }
  }, [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      toast.error(t('error-missing-fields'));
      return;
    }

    setLoading(true);
    try {
      const authenticationResult = await authenticate(
        email,
        password,
        rememberMe,
      );
      if (!authenticationResult.valid) {
        toast.error(authenticationResult.errorMessage || t('error-login'));
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch (error) {
      toast.error(t('error-server'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    getLoginWithGoogleUrl().then((url) => {
      window.location.href = url;
    });
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/login-background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <a className="text-sm text-gray-500">{t('register-text')}</a>
            <a
              href="/sign-up"
              className="text-sm text-gray-500 transition-colors hover:text-[#15b7b9]"
            >
              {' ' + t('register-link')}
            </a>
          </div>
        </div>

        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
          {t('form-title')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              {t('email')}
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t('email-placeholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              />
            </div>
          </div>

          <div className="relative">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {t('password')}
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={t('password-placeholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="group relative flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white transition-all checked:border-[#15b7b9] checked:bg-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9] focus:ring-offset-2"
              />
              <span className="transition-colors duration-150 peer-checked:text-[#15b7b9]">
                {t('remember-me')}
              </span>
            </label>

            <a
              href="/forgot-password"
              className="text-sm text-gray-500 transition-colors hover:text-[#15b7b9]"
            >
              {t('forgot-password')}
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? t('signing-in') : t('sign-in-button')}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">{t('or')}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <img
              src="/assets/google-logo.svg"
              alt="Google"
              className="h-5 w-5"
            />
            {t('sign-in-with-google')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
