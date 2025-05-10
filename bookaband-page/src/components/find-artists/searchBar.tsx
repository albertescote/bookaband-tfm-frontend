import React, { useState } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';

// Register the locales
registerLocale('es', es);
registerLocale('ca', ca);

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
  hasSearched: boolean;
  onClearSearch: () => void;
  setHasSearched: (val: boolean) => void;
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
  hasSearched,
  onClearSearch,
  setHasSearched,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Map language to locale
  const getLocale = () => {
    switch (language) {
      case 'es':
        return 'es';
      case 'ca':
        return 'ca';
      default:
        return 'en';
    }
  };

  const handleSearchClick = () => {
    if (!location.trim() || !date.trim()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate.toISOString().split('T')[0]);
    } else {
      setDate('');
    }
  };

  if (hasSearched) {
    return (
      <div className="flex items-center justify-between rounded-full border border-gray-100 bg-white px-4 py-2 shadow-lg">
        <div
          className="flex cursor-pointer items-center gap-4 rounded-full px-2 py-1 transition-colors hover:bg-gray-50"
          onClick={() => setHasSearched(false)}
        >
          {location && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium">{t('where')}:</span> {location}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium">{t('when')}:</span> {date}
            </span>
          )}
          {searchQuery && (
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium">
                {t('search-style-or-artist')}:
              </span>{' '}
              {searchQuery}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-colors hover:bg-gray-200"
            onClick={() => {
              setLocation('');
              setDate('');
              setSearchQuery('');
              onClearSearch();
            }}
            type="button"
            title={t('clear-search')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full">
        <div className="flex items-center rounded-full border border-gray-100 bg-white px-2 py-2 shadow-lg md:px-4 md:py-0">
          {/* Where? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-base font-semibold text-gray-800">
              {t('where')}
            </span>
            <input
              type="text"
              placeholder={t('enter-location')}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowValidation(false);
              }}
              onKeyPress={handleKeyPress}
              className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                showValidation && !location.trim() ? 'placeholder-red-300' : ''
              }`}
            />
            {showValidation && !location.trim() && (
              <span className="mt-1 text-xs text-red-500">
                {t('location-required')}
              </span>
            )}
          </div>
          {/* Divider */}
          <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
          {/* When? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-base font-semibold text-gray-800">
              {t('when')}
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder={t('add-dates')}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setShowValidation(false);
                }}
                onKeyPress={handleKeyPress}
                onClick={() => setIsDatePickerOpen(true)}
                className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                  showValidation && !date.trim() ? 'placeholder-red-300' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Calendar className="h-4 w-4" />
              </button>
              {isDatePickerOpen && (
                <div className="absolute left-1/2 top-full z-10 mt-6 -translate-x-1/2">
                  <style jsx global>{`
                    .react-datepicker {
                      font-family: inherit;
                      border: none;
                      border-radius: 1rem;
                      box-shadow:
                        0 4px 6px -1px rgb(0 0 0 / 0.1),
                        0 2px 4px -2px rgb(0 0 0 / 0.1);
                      background-color: white;
                      padding: 1rem;
                    }
                    .react-datepicker__header {
                      background-color: white;
                      border-bottom: none;
                      padding-top: 0;
                    }
                    .react-datepicker__current-month {
                      font-size: 1rem;
                      font-weight: 600;
                      color: #374151;
                      margin-bottom: 0.5rem;
                    }
                    .react-datepicker__day-name {
                      color: #6b7280;
                      font-size: 0.875rem;
                      font-weight: 500;
                      width: 2.5rem;
                      margin: 0.2rem;
                    }
                    .react-datepicker__day {
                      width: 2.5rem;
                      height: 2.5rem;
                      line-height: 2.5rem;
                      margin: 0.2rem;
                      border-radius: 9999px;
                      color: #374151;
                      font-size: 0.875rem;
                    }
                    .react-datepicker__day:hover {
                      background-color: #f3f4f6;
                    }
                    .react-datepicker__day--selected {
                      background-color: #15b7b9 !important;
                      color: white !important;
                      font-weight: 600;
                    }
                    .react-datepicker__day--keyboard-selected {
                      background-color: #15b7b9 !important;
                      color: white !important;
                    }
                    .react-datepicker__day--disabled {
                      color: #d1d5db;
                    }
                    .react-datepicker__navigation {
                      top: 1rem;
                    }
                    .react-datepicker__navigation-icon::before {
                      border-color: #6b7280;
                      border-width: 2px 2px 0 0;
                    }
                    .react-datepicker__navigation:hover *::before {
                      border-color: #15b7b9;
                    }
                  `}</style>
                  <DatePicker
                    selected={date ? new Date(date) : null}
                    onChange={handleDateChange}
                    inline
                    minDate={new Date()}
                    onSelect={() => setIsDatePickerOpen(false)}
                    onClickOutside={() => setIsDatePickerOpen(false)}
                    calendarClassName="custom-calendar"
                    locale={getLocale()}
                    dateFormat="P"
                  />
                </div>
              )}
            </div>
            {showValidation && !date.trim() && (
              <span className="mt-1 text-xs text-red-500">
                {t('date-required')}
              </span>
            )}
          </div>
          {/* Divider */}
          <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
          {/* What style or artist? */}
          <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
            <span className="text-base font-semibold text-gray-800">
              {t('search-style-or-artist')}
            </span>
            <input
              type="text"
              placeholder={t('type-style-or-artist')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          {/* Search Button */}
          <button
            className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#15b7b9] shadow-md transition-colors hover:bg-[#109a9c] disabled:opacity-50"
            onClick={handleSearchClick}
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
