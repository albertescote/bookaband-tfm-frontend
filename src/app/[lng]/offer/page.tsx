import { useTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'offer');
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff]"></div>
  );
}
