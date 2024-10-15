'use client';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';

const SupportedLanguages = [
  { id: 'en', value: 'english' },
  { id: 'ca', value: 'catalan' },
  { id: 'es', value: 'spanish' },
];

export default function LanguageSwitcher({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const router = useRouter();

  const changeLanguage = async (newLanguage: string) => {
    if (newLanguage === language) {
      return;
    }
    const oldUrl = window.location.href;
    const newUrl = oldUrl.replace('/' + language, '/' + newLanguage);
    router.push(newUrl);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-4">
      {SupportedLanguages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => changeLanguage(lang.id)}
          className="hover:underline"
        >
          {t(lang.value)}
        </button>
      ))}
    </div>
  );
}
