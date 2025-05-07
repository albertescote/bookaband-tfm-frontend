import { useTranslation } from '@/app/i18n';
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import LanguageSwitcher from '@/components/layout/footer/languageSwitcher';
import Image from 'next/image';
import Link from 'next/link';

export default async function Footer({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'footer');

  return (
    <footer className="bg-[#15b7b9] pb-8 pt-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <Image
            src="/assets/logo-white.svg"
            alt="BookaBand logo"
            height="240"
            width="240"
            className="h-auto w-64"
          />
          <LanguageSwitcher language={language} />
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              {t('navigation.title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${language}/search`} className="hover:underline">
                  {t('navigation.search')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/providers`}
                  className="hover:underline"
                >
                  {t('navigation.providers')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/how-it-works`}
                  className="hover:underline"
                >
                  {t('navigation.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/about`} className="hover:underline">
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/contact`} className="hover:underline">
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('support.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${language}/faqs`} className="hover:underline">
                  {t('support.faqs')}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/help`} className="hover:underline">
                  {t('support.help')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('social.title')}</h3>
            <div className="flex gap-6 text-2xl">
              <a href="#" aria-label="Twitter" className="hover:text-white/80">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white/80">
                <FaFacebook />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white/80">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white/80">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p>© 2024 BookaBand, Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href={`/${language}/terms`} className="hover:underline">
                {t('legal.terms')}
              </Link>
              <Link href={`/${language}/privacy`} className="hover:underline">
                {t('legal.privacy')}
              </Link>
              <Link href={`/${language}/cookies`} className="hover:underline">
                {t('legal.cookies')}
              </Link>
              <Link href={`/${language}/legal`} className="hover:underline">
                {t('legal.notice')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
