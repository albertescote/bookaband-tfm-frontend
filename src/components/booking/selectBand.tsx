'use client';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { BookingsList } from '@/components/booking/bookingsList';

export function SelectBand({ language }: { language: string }) {
  const { t } = useTranslation(language, 'booking');
  const { userBands } = useAuth().userBands;
  const [bandId, setBandId] = useState<string | undefined>(undefined);

  return (
    <div>
      {!bandId ? (
        <div>
          {!!userBands && userBands.length > 0 ? (
            userBands.map((band) => (
              <div
                key={band.id}
                className="my-8 flex items-center justify-between rounded border border-gray-200 p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {band.name}
                </h3>
                <ChevronDoubleRightIcon
                  className="ml-8 h-5 w-5 cursor-pointer"
                  onClick={() => setBandId(band.id)}
                  aria-label="View band chats"
                />
              </div>
            ))
          ) : (
            <h1 className="text-center">{t('not-in-a-band-yet')}</h1>
          )}
        </div>
      ) : (
        <BookingsList
          language={language}
          bandOptions={{ id: bandId, setBandId: setBandId }}
        ></BookingsList>
      )}
    </div>
  );
}
