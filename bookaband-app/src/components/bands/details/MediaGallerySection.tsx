import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Upload, X } from 'lucide-react';
import { FileUpload } from '@/components/common/FileUpload';
import { useState } from 'react';
import { CollapsibleSection } from '@/components/bands/details/CollapsibleSection';
import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  type: string;
}

interface PendingMedia {
  id?: string;
  url: string;
  type: string;
  file: File;
}

interface MediaGallerySectionProps {
  media: (Media | PendingMedia)[];
  isEditing: boolean;
  isAdmin: boolean;
  onMediaUpload: (files: File[]) => void;
  onMediaDelete: (mediaId: string | undefined) => void;
  t: (key: string) => string;
}

export function MediaGallerySection({
  media,
  isEditing,
  isAdmin,
  onMediaUpload,
  onMediaDelete,
  t,
}: MediaGallerySectionProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const handleMediaClick = (mediaItem: Media | PendingMedia) => {
    if ('id' in mediaItem) {
      setSelectedMedia(mediaItem as Media);
    }
  };

  return (
    <>
      <CollapsibleSection
        title={t('form.multimedia.mediaUpload')}
        defaultOpen={false}
      >
        <div className="mb-4 flex justify-end">
          {isAdmin && isEditing && (
            <FileUpload
              onUpload={onMediaUpload}
              accept="image/*,video/*"
              className="rounded-lg bg-[#15b7b9] p-2 text-white hover:bg-[#15b7b9]/90"
            >
              <Upload size={20} />
            </FileUpload>
          )}
        </div>
        {media.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {media.map((mediaItem, index) => (
              <motion.div
                key={'id' in mediaItem ? mediaItem.id : `pending-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                {mediaItem.type === 'image' ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={mediaItem.url}
                      alt=""
                      fill
                      className="cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => handleMediaClick(mediaItem)}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                ) : (
                  <motion.div
                    className="relative h-full w-full cursor-pointer"
                    onClick={() => handleMediaClick(mediaItem)}
                  >
                    <video
                      src={mediaItem.url}
                      className="h-full w-full object-cover"
                      controls
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                )}
                {isAdmin && isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      'id' in mediaItem && onMediaDelete(mediaItem.id)
                    }
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-gray-500">{t('form.multimedia.noMedia')}</p>
          </div>
        )}
      </CollapsibleSection>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <div className="relative h-[90vh] w-[90vw]">
                  <Image
                    src={selectedMedia.url}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
              ) : (
                <video
                  src={selectedMedia.url}
                  className="max-h-[90vh] max-w-[90vw]"
                  controls
                  autoPlay
                />
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMedia(null)}
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-red-600"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
