'use client';

import { useState } from 'react';
import { ArtistDetails } from '@/service/backend/artist/domain/artist';
import { Button } from '@/components/shared/button';

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
  const media = artist.media ?? [];

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const visibleMedia = media.slice(0, visibleCount);
  const hasMore = visibleMedia.length < media.length;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {visibleMedia.map((item) => (
          <div
            key={item.id}
            className="flex h-40 items-center justify-center overflow-hidden rounded-md bg-gray-100"
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={item.url}
                alt="media"
                className="h-full w-full object-cover"
              />
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
    </div>
  );
}
