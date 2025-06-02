import { motion } from 'framer-motion';
import Image from 'next/image';
import { Edit2, X } from 'lucide-react';
import { FileUpload } from '@/components/common/FileUpload';
import { useTranslation } from '@/app/i18n/client';

interface BandImageProps {
  imageUrl: string;
  bandName: string;
  isEditing: boolean;
  onImageUpload: (files: File[]) => void;
  onImageRemove?: () => void;
  language: string;
}

export function BandImage({
  imageUrl,
  bandName,
  isEditing,
  onImageUpload,
  onImageRemove,
  language,
}: BandImageProps) {
  const { t } = useTranslation(language, 'bands');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 overflow-hidden rounded-lg"
    >
      <div className="relative h-[300px] w-full">
        {imageUrl ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={imageUrl}
              alt={bandName}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <p className="text-lg text-gray-500">
              {t('form.noImageAvailable')}
            </p>
          </div>
        )}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 flex gap-2"
          >
            {imageUrl && onImageRemove && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onImageRemove}
                className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-red-600 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
              >
                <X size={18} />
                <span className="font-medium">{t('form.removeImage')}</span>
              </motion.button>
            )}
            <FileUpload
              onUpload={onImageUpload}
              accept="image/*"
              className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Edit2 size={18} />
              </motion.div>
              <span className="font-medium">
                {imageUrl ? t('form.changeImage') : t('form.addImage')}
              </span>
            </FileUpload>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
