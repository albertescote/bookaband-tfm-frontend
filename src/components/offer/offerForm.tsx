'use client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { Offer } from '@/service/backend/offer/domain/offer';
import {
  createOffer,
  deleteOffer,
  getOfferById,
  updateOffer,
} from '@/service/backend/offer/service/offer.service';
import { ArrowLeft } from 'lucide-react';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { getUserBands } from '@/service/backend/band/service/band.service';

export default function OfferForm({
  language,
  bandId,
  offerId,
}: {
  language: string;
  bandId?: string;
  offerId?: string;
}) {
  const { t } = useTranslation(language, 'offer');
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | undefined>();
  const [formData, setFormData] = useState({
    price: 0,
    description: '',
    band: '',
    visible: true,
  });
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFormModified, setIsFormModified] = useState(false);
  const [validUserBands, setValidUserBands] = useState<UserBand[] | undefined>(
    undefined,
  );

  useEffect(() => {
    getUserBands().then((userBandsArray) => {
      const validUserBands = bandId
        ? userBandsArray?.filter((userBand) => {
            return !userBand.offer;
          })
        : userBandsArray;
      setValidUserBands(validUserBands);
    });

    if (offerId) {
      getOfferById(offerId).then((offer) => {
        setOffer(offer);
        setFormData({
          price: offer?.price || 0,
          description: offer?.description || '',
          band: offer?.bandId || '',
          visible: offer?.visible !== undefined ? offer.visible : true,
        });
        setIsVisible(offer?.visible !== undefined ? offer.visible : true);
      });
    }
  }, []);

  useEffect(() => {
    const isModified =
      formData.price !== (offer?.price || '') ||
      formData.description !== (offer?.description || '') ||
      formData.band !== (offer?.bandId || '') ||
      formData.visible !== (offer?.visible || false);
    setIsFormModified(isModified);
  }, [formData, offer]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const price = formData.get('price')?.toString();
    const description = formData.get('description')?.toString();
    const bandId = formData.get('band')?.toString();

    if (offer) {
      updateOffer(offer.id, {
        price: Number(price),
        description,
        bandId,
        visible: isVisible,
      }).then(() => {
        router.push('/manage-offers');
        router.refresh();
      });
    } else {
      createOffer({
        bandId,
        price: Number(price),
        visible: isVisible,
        description,
      }).then(() => {
        router.push('/manage-offers');
        router.refresh();
      });
    }
  };

  const handleDelete = () => {
    deleteOffer(offer!.id).then(() => {
      router.push('/manage-offers');
      router.refresh();
    });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setFormData((prev) => ({ ...prev, visible: !prev.visible }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="mx-auto min-w-[500px] max-w-md space-y-6 overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <div className="relative items-center space-y-4 text-center">
        <ArrowLeft
          className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleGoBack}
        />
        <h1 className="mb-2 text-3xl font-bold">
          {offer ? t('update-offer-title') : t('create-offer-title')}
        </h1>
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
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="band">{t('band-name')}</Label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm"
            id="band"
            name="band"
            required
            value={formData.band}
            onChange={handleInputChange}
            disabled={!bandId}
          >
            {validUserBands?.map((band) => (
              <option key={band.id} value={band.id}>
                {band.name}
              </option>
            ))}
          </select>
          {!bandId && <input type="hidden" name="band" value={formData.band} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('description')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="description"
            name="description"
            placeholder={t('description-placeholder')}
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label>{t('visibility')}</Label>
          <button
            type="button"
            onClick={toggleVisibility}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isVisible ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="flex justify-center pt-4">
          <button
            className={`inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition ${
              !isFormModified
                ? 'opacity-50'
                : 'hover:from-[#b4c6ff] hover:to-[#b4e6ff]'
            }`}
            type="submit"
            disabled={!isFormModified}
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
