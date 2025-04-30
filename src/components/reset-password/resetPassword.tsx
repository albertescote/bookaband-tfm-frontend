'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/app/i18n/client';
import { motion } from 'framer-motion';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Lock } from 'lucide-react';

export default function ResetPassword({ language }: { language: string }) {
  const { t } = useTranslation(language, 'reset-password');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.push('/login');
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
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {t('new-password')}
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                required
                placeholder={t('new-password-placeholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="confirm"
              className="text-sm font-medium text-gray-700"
            >
              {t('confirm-password')}
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="confirm"
                type="password"
                required
                placeholder={t('confirm-password-placeholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
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
