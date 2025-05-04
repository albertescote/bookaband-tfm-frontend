'use client';

import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { FormEvent, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { Role } from '@/service/backend/user/domain/role';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import EmailVerificationWait from './emailVerificationWait';
import { createUser } from '@/service/backend/user/service/user.service';
import { getLoginWithGoogleUrl } from '@/service/backend/auth/service/auth.service';

export default function SignUpForm({ language }: { language: string }) {
  const { t } = useTranslation(language, 'sign-up');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName')?.toString();
    const familyName = formData.get('familyName')?.toString();
    const email = formData.get('email')?.toString();
    const role = selectedRole;

    if (password !== confirmPassword) {
      toast.error(t('password-mismatch'));
      return;
    }

    const passwordValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
    if (!passwordValid) {
      toast.error(t('password-invalid'));
      return;
    }

    setLoading(true);
    try {
      const createdUser = await createUser({
        firstName,
        familyName,
        email,
        password,
        role,
        lng: language,
      });
      if (createdUser) {
        setUserId(createdUser.id);
        setRegisteredEmail(email || '');
        setStep(3);
      } else {
        toast.error(t('error-server'));
      }
    } catch (error) {
      toast.error(t('error-server'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      toast.error(t('please-select-role'));
      return;
    }
    getLoginWithGoogleUrl(selectedRole).then((url) => {
      window.location.href = url;
    });
  };

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

  const handleNavigateBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/login-background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {step === 3 ? (
        <EmailVerificationWait
          language={language}
          email={registeredEmail}
          userId={userId}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleNavigateBack}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <a className="text-sm text-gray-500">
                {t('already-have-account-text')}
              </a>
              <a
                href="/login"
                className="text-sm text-gray-500 transition-colors hover:text-[#15b7b9]"
              >
                {' ' + t('already-have-account-link')}
              </a>
            </div>
          </div>
          {step === 1 ? (
            <>
              <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
                {t('choose-role')}
              </h1>
              <div className="mb-6 space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(Role.Musician);
                    setStep(2);
                  }}
                  className={`w-full rounded-lg border ${
                    selectedRole === Role.Musician
                      ? 'border-[#15b7b9]'
                      : 'border-gray-300'
                  } bg-white p-4 text-left shadow-sm transition hover:border-[#15b7b9]`}
                >
                  <h2 className="text-lg font-bold text-gray-800">
                    {t('musician')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('musician-description')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(Role.Client);
                    setStep(2);
                  }}
                  className={`w-full rounded-lg border ${
                    selectedRole === Role.Client
                      ? 'border-[#15b7b9]'
                      : 'border-gray-300'
                  } bg-white p-4 text-left shadow-sm transition hover:border-[#15b7b9]`}
                >
                  <h2 className="text-lg font-bold text-gray-800">
                    {t('client')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('client-description')}
                  </p>
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
                {t('form-title')}
              </h1>
              <p className="mb-4 text-sm text-gray-600">
                {t('selected-role')}:{' '}
                <span className="font-bold text-gray-800">
                  {t(selectedRole || '')}
                </span>
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        {t('first-name')}
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder={t('first-name-placeholder')}
                        required
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="familyName"
                        className="text-sm font-medium text-gray-700"
                      >
                        {t('family-name')}
                      </Label>
                      <Input
                        id="familyName"
                        name="familyName"
                        placeholder={t('family-name-placeholder')}
                        required
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                      />
                    </div>
                  </div>

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
                      placeholder={t('email-placeholder')}
                      required
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                    />
                  </div>

                  <div className="relative">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t('password')}
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('password-placeholder')}
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-11 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    {loading ? t('signing-up') : t('sign-up-button')}
                  </button>
                </div>
              </form>
              <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">{t('or')}</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

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
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
