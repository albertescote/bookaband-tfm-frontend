'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/app/i18n/client';
import { motion } from 'framer-motion';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/service/backend/user/service/user.service';
import zxcvbn from 'zxcvbn';

export default function ResetPassword({ language }: { language: string }) {
  const { t } = useTranslation(language, 'reset-password');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = zxcvbn(password).score;
  const strengthColors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-lime-400',
    'bg-green-400',
  ];

  const strengthText = [
    t('password-very-weak'),
    t('password-weak'),
    t('password-medium'),
    t('password-strong'),
    t('password-very-strong'),
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error(t('missing-fields'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('password-mismatch'));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success(t('success'));
      router.push(`/${language}/login`);
    } catch {
      toast.error(t('error-server'));
    } finally {
      setLoading(false);
    }
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
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
          {t('form-title')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {t('new-password')}
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('new-password-placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {password && (
              <>
                <div className="mt-3 h-2 w-full rounded bg-gray-200">
                  <div
                    className={`h-2 rounded ${strengthColors[passwordStrength]}`}
                    style={{ width: `${(passwordStrength + 1) * 20}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {strengthText[passwordStrength]}
                </p>
              </>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t('password-requirements')}
            </p>
          </div>

          <div className="relative">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              {t('confirm-password')}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('confirm-password-placeholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? t('submitting') : t('submit-button')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
