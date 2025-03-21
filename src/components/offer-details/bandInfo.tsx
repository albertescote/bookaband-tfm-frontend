export default function BandInfo({
  bandName,
  price,
  genre,
  description,
  t,
}: {
  bandName?: string;
  price?: number;
  genre?: string;
  description?: string;
  t: (key: string) => string;
}) {
  return (
    <>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">{bandName}</h2>
      <p className="mt-2 text-lg text-gray-500">
        {t('price')}: {price} €
      </p>
      <p className="mt-2 text-sm text-gray-600">
        {t('genre')}: <span className="text-gray-800">{genre}</span>
      </p>
      {description && (
        <p className="mt-4 text-center text-sm text-gray-600">{description}</p>
      )}
    </>
  );
}
