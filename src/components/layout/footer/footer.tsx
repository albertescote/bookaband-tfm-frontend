import { useTranslation } from '@/app/i18n';
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import LanguageSwitcher from '@/components/layout/footer/languageSwitcher';
import Image from 'next/image';

export default async function Footer({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'home');
  return (
    <footer className="bg-[#15b7b9] pb-4 pt-6 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">
        <Image
          src="/assets/logo-white.svg"
          alt="logo"
          height="200"
          width="200"
        />
        <LanguageSwitcher language={language} />
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-8">
        {[
          t('price'),
          t('about-us'),
          t('features'),
          t('help-center'),
          t('contact-us'),
          t('faqs'),
        ].map((link) => (
          <a key={link} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>

      <div className="mt-10 border-t border-white"></div>

      <div className="relative mx-auto mt-6 flex max-w-7xl items-center justify-end text-sm">
        <div className="absolute left-1/2 -translate-x-1/2 transform">
          {'© 2024 BookaBand, Inc. • '}
          <a href="#" className="hover:underline">
            {t('privacy')}
          </a>
          {' • '}
          <a href="#" className="hover:underline">
            {t('terms')}
          </a>
        </div>

        <div className="flex gap-4 text-xl">
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaFacebook />
          </a>
          <a href="#">
            <FaLinkedin />
          </a>
          <a href="#">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
