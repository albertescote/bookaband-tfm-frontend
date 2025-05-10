import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { getTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await getTranslation(lng, 'forbidden');
  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff]">
      <div className="text-center">
        <ExclamationCircleIcon className="mx-auto mb-4 h-24 w-24 text-red-500" />
        <h1 className="mb-2 text-5xl font-bold text-gray-800">403</h1>
        <p className="mb-6 text-xl font-semibold text-gray-600">{t('title')}</p>
        <p className="mb-8 text-gray-500">{t('description')}</p>
      </div>
    </div>
  );
}
