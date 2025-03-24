'use client';
import { useTranslation } from '@/app/i18n/client';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { FormEvent } from 'react';
import { Band } from '@/service/backend/band/domain/band';
import { useRouter } from 'next/navigation';
import { MusicGenre } from '@/service/backend/band/domain/musicGenre';
import { createBand } from '@/service/backend/band/service/band.service';

export default function CreateBand({ language }: { language: string }) {
  const { t } = useTranslation(language, 'band');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString();
    const genre = formData.get('genre')?.toString();

    createBand({ name, genre }).then((band: Band | undefined) => {
      router.push(`/band?id=${band?.id}`);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{t('form-title')}</h1>
        <p>{t('form-description')}</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="name"
            name="name"
            placeholder={t('name-placeholder')}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">{t('genre')}</Label>
          <select
            id="genre"
            name="genre"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm"
            required
          >
            <option value={MusicGenre.ROCK}>{t('rock')}</option>
            <option value={MusicGenre.POP}>{t('pop')}</option>
            <option value={MusicGenre.JAZZ}>{t('jazz')}</option>
          </select>
        </div>
        <div className="flex justify-center pt-4">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            type="submit"
          >
            {t('create-button')}
          </button>
        </div>
      </form>
    </div>
  );
}
