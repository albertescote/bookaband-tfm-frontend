import { getRandomColor } from '@/lib/utils';
import Image from 'next/image';

export const getAvatar = (
  size: number,
  imageUrl?: string,
  displayName?: string,
) => {
  const fontSize = size > 10 ? 'text-xl' : 'text-md';

  return imageUrl ? (
    <div className={`relative h-${size} w-${size}`}>
      <Image
        src={imageUrl}
        alt={displayName ?? 'User Profile Image'}
        fill
        className="rounded-full object-cover"
      />
    </div>
  ) : (
    <div
      className={`flex h-${size} w-${size} items-center justify-center rounded-full shadow-sm`}
      style={{
        backgroundColor: getRandomColor(displayName ?? 'dummy'),
      }}
    >
      <span className={`${fontSize} font-bold text-white`}>
        {displayName ? displayName.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );
};
