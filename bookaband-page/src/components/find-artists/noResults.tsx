import React from 'react';
import { SearchX } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

interface NoResultsProps {
  language: string;
  type: 'search' | 'filter';
}

const NoResults: React.FC<NoResultsProps> = ({ language, type }) => {
  const { t } = useTranslation(language, 'find-artists');

  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-8 text-center">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#15b7b9]/10">
          <SearchX className="h-10 w-10 text-[#15b7b9]" strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          {type === 'search' ? t('no-search-results') : t('no-filter-results')}
        </h3>
        <p className="mx-auto max-w-md text-base text-gray-600">
          {type === 'search'
            ? t('no-search-results-description')
            : t('no-filter-results-description')}
        </p>
      </div>
    </div>
  );
};

export default NoResults;
