import { useTranslation } from '@/app/i18n';
import { Band } from '@/service/backend/domain/band';

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default async function BandDetails({
  language,
  band,
}: {
  language: string;
  band: Band | undefined;
}) {
  const { t } = await useTranslation(language, 'band');
  return (
    <div className="flex flex-col items-center">
      {band?.imageUrl ? (
        <img
          src={band.imageUrl}
          alt={band.name}
          className="h-28 w-28 rounded-full object-cover shadow-md"
        />
      ) : (
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
          style={{
            backgroundColor: getRandomColor(band?.name ?? 'dummy'),
          }}
        >
          {band?.name ? band.name.charAt(0) : '?'}
        </div>
      )}
      <span className="mt-4 text-gray-400">{band?.id}</span>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        {band?.name}
      </h2>
      <p className="mt-2 text-lg text-gray-500">
        {t('genre')}: {band?.genre}
      </p>
    </div>
  );
}
