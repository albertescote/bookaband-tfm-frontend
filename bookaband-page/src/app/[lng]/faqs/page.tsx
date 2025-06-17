import { Metadata } from 'next';
import FAQsContent from '@/components/faqs/faqs-content';
import { getTranslation } from '@/app/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getTranslation(lng, 'faqs');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function FAQsPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  return (
    <div className="min-h-screen bg-white">
      <FAQsContent language={lng} />
    </div>
  );
}
