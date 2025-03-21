'use client';
import { useTranslation } from '@/app/i18n/client';
import { Band } from '@/service/backend/domain/band';
import React, { FormEvent, useState } from 'react';
import { joinBand } from '@/service/backend/api';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { getRandomColor } from '@/lib/utils';

export default function BandDetails({
  language,
  band,
}: {
  language: string;
  band: Band | undefined;
}) {
  const { t } = useTranslation(language, 'band');
  const [joinBandModal, setJoinBandModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userEmail = formData.get('user-email')?.toString();
    if (!band?.id || !userEmail) {
      return;
    }
    joinBand(band?.id, userEmail).then(() => {
      setShowPopup(true);
      setTimeout(() => {
        setJoinBandModal(false);
        setShowPopup(false);
      }, 3000);
    });
  };

  return (
    <div>
      {showPopup && (
        <div className="fixed right-4 top-4 px-4 py-2 text-green-500">
          {t('invitation-sent')}
        </div>
      )}
      {!joinBandModal ? (
        <div className="flex flex-col items-center">
          {band?.imageUrl ? (
            <img
              src={band.imageUrl}
              alt={band.name}
              className="h-28 w-28 rounded-full object-cover shadow-md"
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
              style={{
                backgroundColor: getRandomColor(band?.name ?? 'dummy'),
              }}
            >
              {band?.name ? band.name.charAt(0) : '?'}
            </div>
          )}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {band?.name}
          </h2>
          <p className="mt-2 text-lg text-gray-500">
            {t('genre')}: {band?.genre}
          </p>
          <button
            onClick={() => setJoinBandModal(true)}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
          >
            {t('send-invitation')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <form className="w-full max-w-sm space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Label htmlFor="user-email">{t('user-email')}</Label>
              <Input
                type="text"
                id="user-email"
                name="user-email"
                placeholder={t('user-email')}
                className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
                onClick={() => setJoinBandModal(false)}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="mr-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
              >
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
