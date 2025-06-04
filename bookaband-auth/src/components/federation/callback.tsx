'use client';

import { useRouter } from 'next/navigation';
import {
  loginWithGoogle,
  signUpWithGoogle,
} from '@/service/backend/auth/service/auth.service';
import { useEffect, useRef } from 'react';
import { Role } from '@/service/backend/user/domain/role';
import { APP_URL, PAGE_URL } from '@/publicConfig';

export default function Callback({
  code,
  role,
}: {
  code: string;
  role?: string;
}) {
  const hasHandled = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;
    if (role) {
      signUpWithGoogle(code, role).then((authenticationResult) => {
        if (authenticationResult.valid) {
          window.location.href =
            authenticationResult.role === Role.Client
              ? `${PAGE_URL}/`
              : `${APP_URL}/dashboard`;
        } else {
          let errorMessage = 'error-server';
          if (authenticationResult.errorMessage) {
            errorMessage = encodeURI(authenticationResult.errorMessage);
          }

          router.push(`/sign-up?error=${errorMessage}`);
        }
      });
    } else {
      loginWithGoogle(code).then((authenticationResult) => {
        if (authenticationResult.valid) {
          window.location.href =
            authenticationResult.role === Role.Client
              ? `${PAGE_URL}/`
              : `${APP_URL}/dashboard`;
        } else {
          let errorMessage = 'error-server';
          if (authenticationResult.errorMessage) {
            errorMessage = encodeURI(authenticationResult.errorMessage);
          }

          router.push(`/login?error=${errorMessage}`);
        }
      });
    }
  }, [code]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#15b7b9] border-t-transparent" />
      </div>
    </div>
  );
}
