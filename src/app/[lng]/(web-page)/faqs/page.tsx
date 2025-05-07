import { Metadata } from 'next';
import { useTranslation } from '@/app/i18n';
import FAQsContent from '@/components/faqs/faqs-content';

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await useTranslation(lng, 'faqs');
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