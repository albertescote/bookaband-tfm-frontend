import { Metadata } from 'next';
import FAQsContent from '@/components/faqs/faqs-content';
import { getTranslation } from '@/app/i18n';

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'faqs');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default function FAQsPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <div className="min-h-screen bg-white">
      <FAQsContent language={lng} />
    </div>
  );
}
