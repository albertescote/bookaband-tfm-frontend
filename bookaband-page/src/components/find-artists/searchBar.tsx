import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

interface SearchBarProps {
  language: string;
  location: string;
  setLocation: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  language,
  location,
  setLocation,
  date,
  setDate,
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoading,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full">
        <div className="flex items-center rounded-full border border-gray-100 bg-white px-2 py-2 shadow-lg md:px-4 md:py-0">
          {/* Where? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-xs font-bold text-gray-800">
              {t('where')}
            </span>
            <input
              type="text"
              placeholder={t('enter-location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          {/* Divider */}
          <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
          {/* When? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-xs font-bold text-gray-800">{t('when')}</span>
            <input
              type="text"
              placeholder={t('add-dates')}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          {/* Divider */}
          <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
          {/* What style or artist? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-xs font-bold text-gray-800">
              {t('search-style-or-artist')}
            </span>
            <input
              type="text"
              placeholder={t('type-style-or-artist')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          {/* Search Button */}
          <button
            className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#15b7b9] shadow-md transition-colors hover:bg-[#109a9c] disabled:opacity-50"
            onClick={onSearch}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <Search className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
