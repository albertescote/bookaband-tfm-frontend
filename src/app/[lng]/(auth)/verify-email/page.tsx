'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/service/backend/email/service/email.service';
import { VerificationStatus } from '@/service/backend/email/domain/verificationStatus';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus(VerificationStatus.FAILED);
      setMessage('No verification token provided');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail({ token });
        setStatus(response?.status);
        setMessage(response?.message || '');
        
        // Redirect to home page after successful verification
        if (response?.status === VerificationStatus.VERIFIED) {
          setTimeout(() => {
            router.push('/');
          }, 3000); // Redirect after 3 seconds
        }
      } catch (error) {
        setStatus(VerificationStatus.FAILED);
        setMessage('An error occurred during verification');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        {status === VerificationStatus.VERIFIED && (
          <div className="text-center text-green-600">
            <h2 className="mb-4 text-2xl font-bold">
              Email Verified Successfully!
            </h2>
            {message && <p className="text-gray-600">{message}</p>}
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </div>
        )}

        {status === VerificationStatus.FAILED && (
          <div className="text-center text-red-600">
            <h2 className="mb-4 text-2xl font-bold">Verification Failed</h2>
            {message && <p className="text-gray-600">{message}</p>}
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please try the following:
              </p>
              <div className="space-y-2">
                <Link
                  href="/signup"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                >
                  Try Signing Up Again
                </Link>
                <Link
                  href="/contact"
                  className="block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-white hover:bg-gray-700"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
