import React from 'react';
import { useTranslation } from 'react-i18next';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { motion } from 'framer-motion';
import { Facebook, Globe, Instagram, Twitter, Youtube } from 'lucide-react';
import { AiOutlineSpotify, AiOutlineTikTok } from 'react-icons/ai';

interface MultimediaStepProps {
  formData: Partial<BandProfile>;
  onFormDataChange: (data: Partial<BandProfile>) => void;
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
      socialMedia: {
        ...formData.socialMedia,
        [name]: value,
      },
    });
  };

  const handleMultimediaUpload = (files: File[]) => {
    onFormDataChange({
      ...formData,
      multimediaContent: {
        images: formData.multimediaContent?.images || [],
        videos: formData.multimediaContent?.videos || [],
        spotifyLink: formData.multimediaContent?.spotifyLink,
        youtubeLink: formData.multimediaContent?.youtubeLink,
        multimediaFiles: [
          ...(formData.multimediaContent?.multimediaFiles || []),
          ...files,
        ],
      },
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
                value={formData.socialMedia?.instagram || ''}
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
                value={formData.socialMedia?.facebook || ''}
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
                value={formData.socialMedia?.twitter || ''}
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
                value={formData.socialMedia?.tiktok || ''}
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
                value={formData.socialMedia?.website || ''}
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
                value={formData.multimediaContent?.spotifyLink || ''}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    multimediaContent: {
                      images: formData.multimediaContent?.images || [],
                      videos: formData.multimediaContent?.videos || [],
                      spotifyLink: e.target.value,
                      youtubeLink: formData.multimediaContent?.youtubeLink,
                      multimediaFiles:
                        formData.multimediaContent?.multimediaFiles || [],
                    },
                  })
                }
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
                value={formData.multimediaContent?.youtubeLink || ''}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    multimediaContent: {
                      images: formData.multimediaContent?.images || [],
                      videos: formData.multimediaContent?.videos || [],
                      spotifyLink: formData.multimediaContent?.spotifyLink,
                      youtubeLink: e.target.value,
                      multimediaFiles:
                        formData.multimediaContent?.multimediaFiles || [],
                    },
                  })
                }
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

          {formData.multimediaContent?.multimediaFiles &&
            formData.multimediaContent.multimediaFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">
                  {t('form.multimedia.uploadedFiles')}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {formData.multimediaContent.multimediaFiles.map(
                    (file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2"
                      >
                        <span className="truncate text-sm">{file.name}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
}
