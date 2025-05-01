'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { sendResetPasswordEmail } from '@/service/backend/user/service/user.service';

export default function ForgotPassword({ language }: { language: string }) {
  const { t } = useTranslation(language, 'forgot-password');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('missing-email'));
      return;
    }

    setLoading(true);
    try {
      await sendResetPasswordEmail({ email, lng: language });
      toast.success(t('email-sent'));
    } catch (error) {
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
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-500">
            {t('remembered-password')}{' '}
            <a href="/login" className="text-[#15b7b9] hover:underline">
              {t('go-to-login')}
            </a>
          </span>
        </div>

        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
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
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email-placeholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? t('sending') : t('send-link')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
