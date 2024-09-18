import { useTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'home');
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4"></div>
  );
}
