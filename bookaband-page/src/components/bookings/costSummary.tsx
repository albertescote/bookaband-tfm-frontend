'use client';

import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

interface CostSummaryProps {
  formData: {
    initDate: Date;
    endDate: Date;
  };
  artist: ArtistDetails;
  language: string;
  t: (key: string) => string;
}

export function CostSummary({
  formData,
  artist,
  language,
  t,
}: CostSummaryProps) {
  const durationInHours =
    (formData.endDate.getTime() - formData.initDate.getTime()) /
    (1000 * 60 * 60);

  const basePrice = artist.price || 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        {t('costSummary')}
      </h3>
      <dl className="space-y-3">
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">
            {t('basePrice')} ({durationInHours.toFixed(1)} {t('hours')})
          </dt>
          <dd className="text-sm text-gray-900">
            {basePrice.toLocaleString(
              language === 'es'
                ? 'es-ES'
                : language === 'ca'
                  ? 'ca-ES'
                  : 'en-US',
              { style: 'currency', currency: 'EUR' },
            )}
          </dd>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <dt className="text-base font-semibold text-gray-900">
              {t('totalPrice')}
            </dt>
            <dd className="text-base font-semibold text-gray-900">
              {basePrice.toLocaleString(
                language === 'es'
                  ? 'es-ES'
                  : language === 'ca'
                    ? 'ca-ES'
                    : 'en-US',
                { style: 'currency', currency: 'EUR' },
              )}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
