import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { motion } from 'framer-motion';
import { Facebook, Globe, Instagram, Twitter, X, Youtube } from 'lucide-react';
import { AiOutlineSpotify, AiOutlineTikTok } from 'react-icons/ai';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import Image from 'next/image';

interface MultimediaStepProps {
  formData: Partial<UpsertBandRequest>;
  onFormDataChange: (data: Partial<UpsertBandRequest>) => void;
}

export default function MultimediaStep({
  formData,
  onFormDataChange,
}: MultimediaStepProps) {
  const { t } = useTranslation('bands');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      socialLinks: [
        ...(formData.socialLinks || []).filter(
          (link) => link.platform !== name,
        ),
        { platform: name, url: value },
      ],
    });
  };

  const handleMultimediaUpload = (files: File[]) => {
    onFormDataChange({
      ...formData,
      media: [
        ...(formData.media || []),
        ...files.map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          file,
        })),
      ],
    });
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...(formData.media || [])];
    updatedMedia.splice(index, 1);
    onFormDataChange({
      ...formData,
      media: updatedMedia,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.multimedia.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.multimedia.description')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item} className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('form.multimedia.socialMedia')}
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Instagram className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="instagram"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'instagram',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.instagramPlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Facebook className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="facebook"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'facebook',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.facebookPlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Twitter className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="twitter"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'twitter',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.twitterPlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AiOutlineTikTok className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="tiktok"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'tiktok',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.tiktokPlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="website"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'website',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.websitePlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AiOutlineSpotify className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="spotify"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'spotify',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.spotifyPlaceholder')}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Youtube className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="youtube"
                value={
                  formData.socialLinks?.find(
                    (link) => link.platform === 'youtube',
                  )?.url || ''
                }
                onChange={handleInputChange}
                placeholder={t('form.multimedia.youtubePlaceholder')}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('form.multimedia.mediaUpload')}
          </h3>
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-6">
            <FileUpload
              onUpload={handleMultimediaUpload}
              accept="image/*,video/*"
              multiple={true}
            />
            <p className="mt-2 text-sm text-gray-500">
              {t('form.multimedia.uploadDescription')}
            </p>
          </div>

          {formData.media && formData.media.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">
                {t('form.multimedia.uploadedFiles')}
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {formData.media.map((media, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    {media.type === 'image' ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        <Image
                          src={media.url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full w-full"
                      >
                        <video
                          src={media.url}
                          className="h-full w-full object-cover"
                          controls
                        />
                      </motion.div>
                    )}
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
