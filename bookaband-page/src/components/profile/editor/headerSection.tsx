'use client';

import React, { useState } from 'react';
import { CalendarDays, Camera } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';
import { useTranslation } from '@/app/i18n/client';
import { toast } from 'react-hot-toast';

interface HeaderSectionProps {
  firstName: string;
  familyName: string;
  imageUrl?: string;
  joinedDate: string;
  bio?: string;
  language: string;
  onImageUpdate?: (newImageUrl: string) => void;
}

export default function HeaderSection({
  firstName,
  familyName,
  imageUrl,
  joinedDate,
  bio,
  language,
  onImageUpdate,
}: HeaderSectionProps) {
  const { t } = useTranslation(language, 'profile');
  const [isUploading, setIsUploading] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const blobUrl = URL.createObjectURL(file);
      setTempImageUrl(blobUrl);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const data = await response.json();
      onImageUpdate?.(data.url);
      toast.success(t('imageUpdated'));
    } catch (error) {
      toast.error(t('errorUploadingImage'));
      setTempImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
      }
    };
  }, [tempImageUrl]);

  return (
    <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-r from-[#f0faff] to-[#e0f7fa] p-6 shadow-md transition-all">
      <div className="relative">
        {getAvatar(20, tempImageUrl || imageUrl, firstName)}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15b7b9] text-white transition-colors hover:bg-[#15b7b9]/90 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </label>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">
          {firstName + ' ' + familyName}
        </h1>
        {bio && <p className="mt-1 text-sm text-gray-600">{bio}</p>}
        <div className="mt-2 flex flex-col text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-[#15b7b9]" />
            <span>
              {t('joinedLabel')}
              {joinedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
