import { getRandomColor } from '@/lib/utils';

export default function BandAvatar({
  imageUrl,
  bandName,
}: {
  imageUrl?: string;
  bandName?: string;
}) {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt={bandName}
      className="h-28 w-28 rounded-full object-cover shadow-md"
    />
  ) : (
    <div
      className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
      style={{
        backgroundColor: getRandomColor(bandName ?? 'dummy'),
      }}
    >
      {bandName ? bandName.charAt(0) : '?'}
    </div>
  );
}
