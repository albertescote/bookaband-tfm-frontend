'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Globe } from 'lucide-react';

const SupportedLanguages = [
  { id: 'en', value: 'english' },
  { id: 'ca', value: 'catalan' },
  { id: 'es', value: 'spanish' },
];

export default function LanguageSwitcher({ language }: { language: string }) {
  const { t } = useTranslation(language, 'home');
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(
    SupportedLanguages.find((lang) => lang.id === language) ||
      SupportedLanguages[0],
  );

  const changeLanguage = async (newLanguage: string) => {
    if (newLanguage === language) return;
    const oldUrl = window.location.href;
    const newUrl = oldUrl.replace('/' + language, '/' + newLanguage);
    router.push(newUrl);
    router.refresh();
  };

  const handleChange = (lang: { id: string; value: string }) => {
    setSelectedLanguage(lang);
    changeLanguage(lang.id).then();
  };

  return (
    <Listbox value={selectedLanguage} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]">
          <Globe className="h-5 w-5" />
          <span className="flex-1 text-left">{t(selectedLanguage.value)}</span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
        >
          <Listbox.Options className="absolute bottom-full left-0 mb-2 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {SupportedLanguages.map((lang) => (
              <Listbox.Option
                key={lang.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none px-3 py-2 ${
                    active ? 'bg-[#15b7b9]/10 text-[#15b7b9]' : 'text-gray-700'
                  }`
                }
                value={lang}
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                  >
                    {t(lang.value)}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 