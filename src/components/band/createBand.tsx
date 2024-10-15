'use client';
import { useTranslation } from '@/app/i18n';
import { Label } from '@/components/shared/label';
import { Input } from '@/components/shared/input';
import { FormEvent } from 'react';
import { Band } from '@/service/backend/domain/band';
import { createBand } from '@/service/backend/api';

export default async function CreateBand({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'band');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString();
    const genre = formData.get('genre')?.toString();

    createBand({ name, genre }).then((band: Band | undefined) => {
      window.location.href = `/band?id=${band?.id}`;
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
          <Input
            className="w-full rounded-md border-gray-300 shadow-sm transition focus:border-[#0077b6] focus:ring focus:ring-[#0077b6] focus:ring-opacity-50"
            id="genre"
            name="genre"
            placeholder={t('genre-placeholder')}
            required
            minLength={8}
          />
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
