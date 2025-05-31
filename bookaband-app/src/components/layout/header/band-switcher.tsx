'use client';

import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getAvatar } from '@/components/shared/avatar';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { useAuth } from '@/providers/authProvider';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle, Settings } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

interface BandSwitcherProps {
  bands: UserBand[];
}

export function BandSwitcher({ bands }: BandSwitcherProps) {
  const { selectedBand, setSelectedBand } = useAuth();
  const router = useRouter();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleCreateBand = () => {
    router.push(`/${language}/bands/create`);
  };

  const handleManageBands = () => {
    router.push(`/${language}/bands`);
  };

  if (bands.length === 0) {
    return (
      <button
        onClick={handleCreateBand}
        className="flex items-center gap-2 bg-[#15b7b9] text-white px-4 py-2 rounded-lg hover:bg-[#15b7b9]/90 transition-colors"
      >
        <PlusCircle size={20} />
        {t('createBand')}
      </button>
    );
  }

  return (
    <Listbox value={selectedBand} onChange={setSelectedBand}>
      <div className="relative">
        <Listbox.Button className="flex w-full min-w-[200px] items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]">
          <div className="flex flex-1 items-center space-x-4">
            <span className="flex-1 truncate text-left">
              {selectedBand?.name}
            </span>
            {selectedBand &&
              getAvatar(36, 36, selectedBand.imageUrl, selectedBand.name)}
          </div>
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
          <Listbox.Options className="absolute left-0 top-full mt-2 w-full min-w-[200px] overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {bands.map((band) => (
              <Listbox.Option
                key={band.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none px-3 py-2 ${
                    active ? 'bg-[#15b7b9]/10 text-[#15b7b9]' : 'text-gray-700'
                  }`
                }
                value={band}
              >
                {({ selected }) => (
                  <div className="flex items-center space-x-2">
                    {getAvatar(24, 24, band.imageUrl, band.name)}
                    <span
                      className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                    >
                      {band.name}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={handleManageBands}
              className="flex w-full items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
            >
              <Settings size={20} />
              <span>{t('manageBands')}</span>
            </button>
            <button
              onClick={handleCreateBand}
              className="flex w-full items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
            >
              <PlusCircle size={20} />
              <span>{t('createNewBand')}</span>
            </button>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
