'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import BandProfileForm from '@/components/bands/BandProfileForm';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';
import { createBand } from '@/service/backend/band/service/band.service';

export default function CreateBandPage() {
  const router = useRouter();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleSubmit = async (data: BandProfile) => {
    try {
      await createBand(data);
      router.push('/bands');
      window.location.reload();
    } catch (error) {
      console.error('Error creating band:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="mb-2 text-3xl font-bold">{t('createBand')}</h1>
      <BandProfileForm onSubmit={handleSubmit} />
    </div>
  );
}
