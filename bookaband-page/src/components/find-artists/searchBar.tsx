import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import './autocomplete-custom.css';
import { ca, enGB, es } from 'date-fns/locale';

registerLocale('es', es);
registerLocale('ca', ca);
registerLocale('en', enGB);

interface SearchBarProps {
  language: string;
  location: string;
  setLocation: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  setTimezone: (val: string) => void;
  artistName: string;
  setArtistName: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  hasSearched: boolean;
  onClearSearch: () => void;
  setHasSearched: (val: boolean) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const SearchBar: React.FC<SearchBarProps> = ({
  language,
  location,
  setLocation,
  date,
  setDate,
  setTimezone,
  artistName,
  setArtistName,
  onSearch,
  isLoading,
  hasSearched,
  onClearSearch,
  setHasSearched,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [displayLocation, setDisplayLocation] = useState(location);

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

  const initializeAutocomplete = () => {
    if (window.google && locationInputRef.current) {
      const options = {
        componentRestrictions: { country: ['es'] },
        fields: ['address_components', 'formatted_address'],
        types: ['(cities)'],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        options,
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.address_components) {
          const cityComponent = place.address_components.find(
            (component: any) => component.types.includes('locality'),
          );

          if (cityComponent) {
            const cityName = cityComponent.long_name;
            setLocation(cityName);
            setDisplayLocation(cityName);
          }
          setShowValidation(false);
        }
      });
    }
  };

  useEffect(() => {
    initializeAutocomplete();
  }, []);

  useEffect(() => {
    if (!hasSearched) {
      initializeAutocomplete();
    }
  }, [hasSearched]);

  const handleSearchClick = () => {
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } else {
      setDate('');
      setTimezone('');
    }
  };

  if (hasSearched) {
    return (
      <div className="flex items-center justify-between rounded-full border border-gray-100 bg-white px-3 py-2 shadow-lg sm:px-4 sm:py-2">
        <div
          className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-gray-50 sm:gap-4"
          onClick={() => setHasSearched(false)}
        >
          {location && (
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <span className="font-medium">{t('where')}:</span>{' '}
              {displayLocation}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <span className="font-medium">{t('when')}:</span> {date}
            </span>
          )}
          {artistName && (
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <span className="font-medium">
                {t('search-style-or-artist')}:
              </span>{' '}
              {artistName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-colors hover:bg-gray-200 sm:h-8 sm:w-8"
            onClick={() => {
              setLocation('');
              setDisplayLocation('');
              setDate('');
              setTimezone('');
              setArtistName('');
              onClearSearch();
            }}
            type="button"
            title={t('clear-search')}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full">
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:px-4 sm:py-0">
          <div className="flex w-full min-w-0 flex-col px-2 py-2 sm:px-4 sm:py-4">
            <span className="text-sm font-semibold text-gray-800 sm:text-base">
              {t('where')}
            </span>
            <input
              ref={locationInputRef}
              type="text"
              placeholder={t('enter-city-name')}
              value={displayLocation}
              onChange={(e) => {
                setDisplayLocation(e.target.value);
                setLocation(e.target.value);
                setShowValidation(false);
              }}
              onKeyPress={handleKeyPress}
              className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                showValidation &&
                !location.trim() &&
                !date.trim() &&
                !artistName.trim()
                  ? 'placeholder-red-300'
                  : ''
              }`}
            />
          </div>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="flex w-full min-w-0 flex-col px-2 py-2 sm:px-4 sm:py-4">
            <span className="text-sm font-semibold text-gray-800 sm:text-base">
              {t('when')}
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder={t('select-event-date')}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setShowValidation(false);
                }}
                onKeyPress={handleKeyPress}
                onClick={() => setIsDatePickerOpen(true)}
                className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                  showValidation &&
                  !location.trim() &&
                  !date.trim() &&
                  !artistName.trim()
                    ? 'placeholder-red-300'
                    : ''
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
                <div className="fixed left-0 right-0 top-1/2 z-50 mx-auto w-[90%] -translate-y-1/2 sm:absolute sm:left-1/3 sm:top-full sm:mt-6 sm:w-auto sm:-translate-x-1/2 sm:translate-y-0">
                  <DatePicker
                    selected={date ? new Date(date + 'T00:00:00') : null}
                    onChange={handleDateChange}
                    inline
                    minDate={new Date()}
                    onSelect={() => setIsDatePickerOpen(false)}
                    onClickOutside={() => setIsDatePickerOpen(false)}
                    calendarClassName="custom-calendar"
                    locale={getLocale()}
                    dateFormat="P"
                    adjustDateOnChange={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="flex w-full min-w-0 flex-col px-2 py-2 sm:px-4 sm:py-4">
            <span className="text-sm font-semibold text-gray-800 sm:text-base">
              {t('artist-name')}
            </span>
            <input
              type="text"
              placeholder={t('enter-artist-name')}
              value={artistName}
              onChange={(e) => {
                setArtistName(e.target.value);
                setShowValidation(false);
              }}
              onKeyPress={handleKeyPress}
              className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                showValidation &&
                !location.trim() &&
                !date.trim() &&
                !artistName.trim()
                  ? 'placeholder-red-300'
                  : ''
              }`}
            />
          </div>

          <button
            className="mt-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#15b7b9] shadow-md transition-colors hover:bg-[#109a9c] disabled:opacity-50 sm:mt-0"
            onClick={handleSearchClick}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="h-6 w-6 animate-spin text-white"
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
              <Search className="h-6 w-6 text-white" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
