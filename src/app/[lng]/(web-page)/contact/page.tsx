import { Metadata } from 'next';
import { getTranslation } from '@/app/i18n';
import ContactForm from '@/components/web-page/contact/contactForm';

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await getTranslation(lng, 'contact');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function ContactPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = await getTranslation(lng, 'contact');

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#565d6d] sm:text-5xl md:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#565d6d]/80">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#15b7b9]/5" />
          <div className="relative">
            <ContactForm language={lng} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15b7b9] to-[#15b7b9]/90 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="mb-6 text-3xl font-bold text-white">
              {t('additional-info.title')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('additional-info.community.title')}
                </h3>
                <p className="text-white/90">
                  {t('additional-info.community.description')}
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('additional-info.updates.title')}
                </h3>
                <p className="text-white/90">
                  {t('additional-info.updates.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
