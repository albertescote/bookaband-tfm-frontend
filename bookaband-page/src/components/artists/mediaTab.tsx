'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/button';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

const INITIAL_ITEMS = 6;
const LOAD_MORE_COUNT = 6;

export function MediaTab({
  artist,
  t,
}: {
  artist: ArtistDetails;
  t: (key: string) => string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const media = artist.media ?? [];

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const handleMediaClick = (url: string, type: string) => {
    setSelectedMedia({ url, type });
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  const visibleMedia = media.slice(0, visibleCount);
  const hasMore = visibleMedia.length < media.length;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {visibleMedia.map((item) => (
          <div
            key={item.id}
            className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-gray-100"
            onClick={() => handleMediaClick(item.url, item.type)}
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src={item.url}
                  alt="media"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            className="text-[#15b7b9]"
            onClick={handleLoadMore}
          >
            {t('seeMore')}
          </Button>
        </div>
      )}

      {/* Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'VIDEO' ? (
              <video
                src={selectedMedia.url}
                controls
                className="max-h-[90vh] max-w-[90vw]"
              />
            ) : (
              <div className="relative h-[90vh] w-[90vw]">
                <Image
                  src={selectedMedia.url}
                  alt="media"
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority={true}
                />
              </div>
            )}
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
