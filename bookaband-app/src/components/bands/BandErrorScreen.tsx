'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { ArrowLeft } from 'lucide-react';

interface BandErrorScreenProps {
  language: string;
  title?: string;
  description?: string;
}

export default function BandErrorScreen({
  language,
  title,
  description,
}: BandErrorScreenProps) {
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </button>

      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-red-100 p-4">
          <svg
            className="h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          {title || t('errorScreen.title')}
        </h2>
        <p className="max-w-md text-gray-600">
          {description || t('errorScreen.description')}
        </p>
      </div>
    </div>
  );
}
