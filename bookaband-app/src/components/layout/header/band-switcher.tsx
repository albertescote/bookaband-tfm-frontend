'use client';

import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getAvatar } from '@/components/shared/avatar';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { useAuth } from '@/providers/authProvider';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

interface BandSwitcherProps {
  bands: UserBand[];
}

export function BandSwitcher({ bands }: BandSwitcherProps) {
  const { selectedBand, setSelectedBand } = useAuth();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleChangeBand = (newSelectedBand: UserBand) => {
    setSelectedBand(newSelectedBand);
    window.location.reload();
  };

  if (bands.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500">
        {t('noBands')}
      </div>
    );
  }

  return (
    <Listbox value={selectedBand} onChange={handleChangeBand}>
      <div className="relative">
        <Listbox.Button className="flex w-full min-w-[200px] items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]">
          <div className="flex flex-1 items-center space-x-4">
            <span className="flex-1 truncate text-left">
              {selectedBand?.name}
            </span>
            {selectedBand &&
              getAvatar(10, selectedBand.imageUrl, selectedBand.name)}
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
                    {getAvatar(8, band.imageUrl, band.name)}
                    <span
                      className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                    >
                      {band.name}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
