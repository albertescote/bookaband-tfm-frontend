'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { ArrowLeft } from 'lucide-react';
import {
  createBand,
  UpsertBandRequest,
} from '@/service/backend/band/service/band.service';
import { toast } from 'react-hot-toast';
import BandProfileForm from './BandProfileForm';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';

interface CreateBandFormProps {
  language: string;
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
}

interface FormDataWithFiles extends Partial<UpsertBandRequest> {
  imageFile?: File;
}

export default function CreateBandForm({
  language,
  musicalStyles,
  eventTypes,
}: CreateBandFormProps) {
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();

  const handleSubmit = async (data: FormDataWithFiles) => {
    try {
      const { imageFile, ...bandData } = data;
      await createBand(bandData as UpsertBandRequest);
      toast.success(t('successCreating'));
      router.push(`/${language}/bands`);
    } catch (err) {
      console.error('Error creating band:', err);
      toast.error(t('errorCreating'));
      throw err;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </button>

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          {t('createBand')}
        </h1>

        <BandProfileForm
          onSubmit={handleSubmit}
          musicalStyles={musicalStyles}
          eventTypes={eventTypes}
        />
      </div>
    </div>
  );
}
