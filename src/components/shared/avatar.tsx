import { getRandomColor } from '@/lib/utils';

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
      className="rounded-full object-cover"
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full text-lg font-bold text-white"
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
