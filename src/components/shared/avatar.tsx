import { getRandomColor } from '@/lib/utils';
import React from 'react';

export const getAvatar = (
  height: number,
  width: number,
  imageUrl?: string,
  displayName?: string,
) => {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt={displayName}
      className={`h-${height} w-${width} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`flex h-${height} w-${width} items-center justify-center rounded-full text-lg font-bold text-white`}
      style={{ backgroundColor: getRandomColor(displayName ?? 'dummy') }}
    >
      {displayName ? displayName.charAt(0).toUpperCase() : '?'}
    </div>
  );
};
