'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';

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
    <div className="w-40 text-white">
      <Listbox value={selectedLanguage} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-full border bg-transparent py-2 pl-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span className="block truncate">{t(selectedLanguage.value)}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDownIcon
                className="h-5 w-5 text-white"
                aria-hidden="true"
              />
            </span>
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
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#f3f4f6] py-1 text-base focus:outline-none">
              {SupportedLanguages.map((lang) => (
                <Listbox.Option
                  key={lang.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#15b7b9] text-white' : 'text-gray-900'
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
    </div>
  );
}
