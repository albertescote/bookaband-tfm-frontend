import { getRandomColor } from '@/lib/utils';

export const getAvatar = (
  height: number,
  width: number,
  imageUrl?: string,
  displayName?: string,
) => {
  const size = Math.min(height, width);
  const fontSize = size > 40 ? 'text-xl' : 'text-md';

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={displayName}
      className="rounded-full object-cover"
      style={{ height: `${height}px`, width: `${width}px` }}
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
