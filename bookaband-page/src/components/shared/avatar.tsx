import { getRandomColor } from '@/lib/utils';
import Image from 'next/image';

export const getAvatar = (
  size: number,
  imageUrl?: string,
  displayName?: string,
) => {
  const fontSize = size > 40 ? 'text-xl' : 'text-md';

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
      className={`flex items-center justify-center rounded-full font-bold text-white ${fontSize} shadow-sm`}
      style={{
        backgroundColor: getRandomColor(displayName ?? 'dummy'),
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      {displayName ? displayName.charAt(0).toUpperCase() : '?'}
    </div>
  );
};
