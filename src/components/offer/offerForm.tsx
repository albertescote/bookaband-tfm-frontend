'use client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { Offer } from '@/service/backend/domain/offer';
import { useAuth } from '@/providers/AuthProvider';
import { createOffer, deleteOffer, updateOffer } from '@/service/backend/api';

export default function OfferForm({
  language,
  bandId,
  offer,
}: {
  language: string;
  bandId?: string;
  offer?: Offer;
}) {
  const { t } = useTranslation(language, 'offer');
  const router = useRouter();
  const { changeMe, userBands } = useAuth();
  const [defaultBandValue, setDefaultBandValue] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (bandId) {
      const defaultBandId = userBands.userBands.find((band) => {
        return band.id === bandId;
      })?.id;
      setDefaultBandValue(defaultBandId);
    } else if (offer) {
      const defaultBandId = userBands.userBands.find((band) => {
        return band.id === offer.bandId;
      })?.id;
      setDefaultBandValue(defaultBandId);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const price = formData.get('price')?.toString();
    const description = formData.get('description')?.toString();
    const bandId = formData.get('band')?.toString();

    if (offer) {
      updateOffer(offer.id, { price: Number(price), description, bandId }).then(
        () => {
          router.push('/manage-offers');
          changeMe.setChangeMe(!changeMe.changeMe);
          router.refresh();
        },
      );
    } else {
      createOffer({ price: Number(price), description, bandId }).then(() => {
        router.push('/manage-offers');
        changeMe.setChangeMe(!changeMe.changeMe);
        router.refresh();
      });
    }
  };

  const handleDelete = () => {
    deleteOffer(offer!.id).then(() => {
      router.push('/manage-offers');
      changeMe.setChangeMe(!changeMe.changeMe);
      router.refresh();
    });
  };

  return (
    <div className="mx-auto min-w-[500px] max-w-md space-y-6 overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <div className="space-y-4 text-center">
        <h1 className="mb-2 text-3xl font-bold">
          {offer ? t('update-offer-title') : t('create-offer-title')}
        </h1>
        {offer && (
          <span className="text-lg text-gray-500">
            {t('form-description')}
            {offer.id}
          </span>
        )}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="price">{t('price')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="price"
            name="price"
            type="number"
            placeholder={t('price-placeholder')}
            required
            defaultValue={offer?.price || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="band">{t('band-name')}</Label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm"
            id="band"
            name="band"
            required
            value={defaultBandValue || ''}
            onChange={(e) => setDefaultBandValue(e.target.value)}
          >
            {userBands?.userBands.map((band) => (
              <option key={band.id} value={band.id}>
                {band.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('description')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="description"
            name="description"
            placeholder={t('description-placeholder')}
            defaultValue={offer?.description || ''}
          />
        </div>
        <div className="flex justify-center pt-4">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            type="submit"
          >
            {offer ? t('update-button') : t('create-button')}
          </button>
        </div>
      </form>
      {offer && (
        <div className="flex justify-center">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-700"
            onClick={handleDelete}
          >
            {t('delete-button')}
          </button>
        </div>
      )}
    </div>
  );
}
