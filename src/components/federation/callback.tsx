'use client';

import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/service/backend/auth/service/auth.service';
import { useEffect } from 'react';

export default function Callback({ code }: { code: string }) {
  const router = useRouter();

  useEffect(() => {
    loginWithGoogle(code).then((authenticationResult) => {
      if (authenticationResult.valid) {
        router.push('/dashboard');
      } else {
        let errorMessage = 'error-server';
        if (authenticationResult.errorMessage) {
          errorMessage = encodeURI(authenticationResult.errorMessage);
        }

        router.push(`/login?error=${errorMessage}`);
      }
    });
  }, [code]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#15b7b9] border-t-transparent" />
      </div>
    </div>
  );
}
