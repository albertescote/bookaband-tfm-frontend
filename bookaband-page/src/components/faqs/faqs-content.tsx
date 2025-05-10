'use client';

import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import { AccordionItem } from '@/components/faqs/accordion-item';

export default function FAQsContent({ language }: { language: string }) {
  const { t } = useTranslation(language, 'faqs');

  return (
    <>
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

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {Object.entries(t('categories', { returnObjects: true })).map(
          ([categoryKey, category]: [string, any]) => (
            <div key={categoryKey} className="mb-12">
              <h2 className="mb-8 text-2xl font-bold text-[#565d6d]">
                {category.title}
              </h2>
              <div className="space-y-2">
                {Object.entries(category.questions).map(
                  ([questionKey, question]: [string, any]) => (
                    <AccordionItem
                      key={questionKey}
                      question={question.question}
                      answer={question.answer}
                    />
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#15b7b9]/5" />
          <div className="relative text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#565d6d] sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#565d6d]/80">
              {t('cta.description')}
            </p>
            <div className="mt-8">
              <Link
                href={`/${language}/contact`}
                className="inline-block rounded-lg bg-[#15b7b9] px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-[#15b7b9]/90"
              >
                {t('cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
