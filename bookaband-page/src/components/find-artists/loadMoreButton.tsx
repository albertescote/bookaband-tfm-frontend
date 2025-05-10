import React from 'react';
import { useTranslation } from '@/app/i18n/client';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  language: string;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  isLoading,
  hasMore,
  language,
}) => {
  const { t } = useTranslation(language, 'find-artists');

  if (!hasMore) return null;

  return (
    <div className="mt-10 flex justify-center">
      <button
        className="flex items-center gap-2 rounded-full bg-[#15b7b9] px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#109a9c] disabled:opacity-50"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {t('loading')}
          </>
        ) : (
          t('load-more-artists')
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
