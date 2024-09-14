import LanguageSwitcher from '@/components/languageSwitcher';
import { useTranslation } from '@/app/i18n';

export default async function Footer({ language }: { language: string }) {
  const { t } = await useTranslation(language, 'home');
  return (
    <footer className="bg-gradient-to-r from-[#b4c6ff] to-[#b4e6ff] py-8">
      <div className="mx-4 flex items-center justify-center">
        <span className="mr-8">{t('rights')}</span>
        <LanguageSwitcher language={language} />
      </div>
    </footer>
  );
}
