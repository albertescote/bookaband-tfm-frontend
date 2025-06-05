import { getRandomColor } from '@/lib/utils';
import Image from 'next/image';

export const getAvatar = (
  height: number,
  width: number,
  imageUrl?: string,
  displayName?: string,
) => {
  const size = Math.min(height, width);
  const fontSize = size > 40 ? 'text-xl' : 'text-md';

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={displayName ?? 'User Profile Image'}
      height={height}
      width={width}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${fontSize} shadow-sm`}
      style={{
        backgroundColor: getRandomColor(displayName ?? 'dummy'),
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      {displayName ? displayName.charAt(0).toUpperCase() : '?'}
    </div>
  );
};
