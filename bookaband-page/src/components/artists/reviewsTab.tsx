'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { ArtistReview } from '@/service/backend/artist/domain/artistDetails';

export function ReviewsTab({
  reviews = [],
  t,
  language,
}: {
  reviews?: ArtistReview[];
  t: (key: string) => string;
  language: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const DISPLAY_LIMIT = 3;

  const visibleReviews = showAll ? reviews : reviews.slice(0, DISPLAY_LIMIT);

  if (!reviews.length) {
    return <p className="mt-4 text-sm text-gray-500">{t('noReviews')}</p>;
  }

  return (
    <div className="mt-4 space-y-6">
      {visibleReviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            {review.reviewer.imageUrl ? (
              <img
                src={review.reviewer.imageUrl}
                alt={review.reviewer.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-medium text-gray-600">
                {review.reviewer.name[0]}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < review.rating ? '#facc15' : 'none'}
                    stroke="#facc15"
                  />
                ))}
              </div>

              <p className="mt-3 text-sm text-gray-700">{review.comment}</p>

              <div className="mt-3 text-xs text-gray-400">
                {review.reviewer.name} —{' '}
                {new Date(review.date).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      ))}

      {reviews.length > DISPLAY_LIMIT && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-[#15b7b9] hover:underline"
          >
            {showAll ? t('showLess') : t('seeMore')}
          </button>
        </div>
      )}
    </div>
  );
}
