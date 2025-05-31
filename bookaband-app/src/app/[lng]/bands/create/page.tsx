'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { AlignLeft, ArrowLeft, Music, Type, Upload } from 'lucide-react';
import { createBand } from '@/service/backend/band/service/band.service';
import { MusicGenre } from '@/service/backend/band/domain/musicGenre';

interface BandFormData {
  name: string;
  description: string;
  genre: MusicGenre;
  image?: File;
}

export default function CreateBandPage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const [formData, setFormData] = useState<BandFormData>({
    name: '',
    description: '',
    genre: MusicGenre.ROCK,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createBand({
        name: formData.name,
        genre: formData.genre,
      });

      if (response) {
        router.push('/bands');
        window.location.reload();
      } else {
        setError(t('errorCreating'));
      }
    } catch (error) {
      console.error('Error creating band:', error);
      setError(t('errorCreating'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        {t('back')}
      </button>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {t('createNew')}
        </h1>
        <p className="mb-8 text-gray-600">{t('createBandDescription')}</p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Band Image Upload */}
          <div className="space-y-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('bandImage')}
            </label>
            <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 transition-colors hover:border-[#15b7b9]">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Band preview"
                      className="mx-auto h-40 w-40 rounded-lg object-cover shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: undefined }));
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-colors hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex justify-center text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-[#15b7b9] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#15b7b9] focus-within:ring-offset-2 hover:text-[#15b7b9]/90"
                      >
                        <span>{t('uploadImage')}</span>
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">{t('orDragAndDrop')}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('imageRequirements')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Band Name */}
          <div className="relative">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t('name')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm transition-colors focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                placeholder={t('namePlaceholder')}
              />
            </div>
          </div>

          {/* Genre */}
          <div className="relative">
            <label
              htmlFor="genre"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t('genre')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Music className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="genre"
                name="genre"
                required
                value={formData.genre}
                onChange={handleInputChange}
                className="block w-full appearance-none rounded-lg border-gray-300 bg-white pl-10 shadow-sm transition-colors focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              >
                <option value="">{t('selectGenre')}</option>
                {Object.values(MusicGenre).map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {t('description')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-3 flex items-start">
                <AlignLeft className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full resize-none rounded-lg border-gray-300 pl-10 shadow-sm transition-colors focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-[#15b7b9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#15b7b9]/90 disabled:opacity-50"
            >
              {isSubmitting ? t('creating') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
