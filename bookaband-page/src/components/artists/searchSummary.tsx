'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

interface SearchSummaryProps {
  location?: string;
  date?: string;
  language: string;
}

export function SearchSummary({
  location,
  date,
  language,
}: SearchSummaryProps) {
  const { t } = useTranslation(language, 'artists');

  if (!location && !date) return null;

  return (
    <div className="mb-6 rounded-lg border border-[#e2f7f7] bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-gray-700">
        {t('searchSummary')}
      </h3>
      <div className="flex flex-wrap gap-4">
        {location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="mr-2 h-4 w-4 text-[#15b7b9]" />
            {location}
          </div>
        )}
        {date && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-[#15b7b9]" />
            {new Date(date).toLocaleDateString(language, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </div>
    </div>
  );
}
