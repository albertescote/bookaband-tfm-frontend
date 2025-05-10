'use client';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import { getUserBands } from '@/service/backend/band/service/band.service';
import { Spinner } from '@/components/shared/spinner';
import { BookingsList } from '@/components/booking/bookingsList';
import { UserBand } from '@/service/backend/band/domain/userBand';

export function SelectBand({ language }: { language: string }) {
  const { t } = useTranslation(language, 'booking');
  const [userBands, setUserBands] = useState<UserBand[] | undefined>([]);
  const [bandId, setBandId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserBands().then((userBandsArray) => {
      setUserBands(userBandsArray);
      setBandId(
        userBandsArray?.length === 1 ? userBandsArray[0].id : undefined,
      );
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[25vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-12 w-12 text-blue-500" />
        <p className="text-lg font-medium text-gray-600">
          Loading your bookings...
        </p>
      </div>
    );
  }

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
          bandOptions={{
            id: bandId,
            setBandId: setBandId,
            multiple: userBands?.length ? userBands.length > 1 : false,
          }}
        ></BookingsList>
      )}
    </div>
  );
}
