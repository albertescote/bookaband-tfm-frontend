'use client';

import { Star } from 'lucide-react';
import { ArtistReview } from '@/service/backend/artist/domain/artistDetails';

export function ReviewsTab({
  reviews = [],
  t,
}: {
  reviews?: ArtistReview[];
  t: (key: string) => string;
}) {
  if (!reviews.length) {
    return <p className="mt-4 text-sm text-gray-500">{t('noReviews')}</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-1 flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < review.rating ? '#facc15' : 'none'}
                stroke="#facc15"
              />
            ))}
          </div>

          <p className="text-sm text-gray-700">{review.comment}</p>

          <div className="mt-2 text-xs text-gray-400">
            {review.reviewer} — {new Date(review.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
