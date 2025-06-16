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

interface Place {
  id: string;
  name: string;
  type: 'city';
}

interface GooglePrediction {
  place_id: string;
  description: string;
  types: string[];
}

interface GooglePlaceDetails {
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
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
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<Place[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCitySearching, setIsCitySearching] = useState(false);
  const locationInputRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setCitySuggestions([]);
        setIsCitySearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySearch = async (query: string) => {
    setCitySearchQuery(query);
    setIsCitySearching(true);
    if (!query.trim() || !isGoogleMapsLoaded) {
      setCitySuggestions([]);
      return;
    }

    try {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      const request = {
        input: query,
        types: ['(cities)'],
        componentRestrictions: { country: ['es'] },
        language: language,
      };

      const response = await autocompleteService.getPlacePredictions(request);
      const places = response.predictions.map(
        (prediction: GooglePrediction): Place => {
          const cityName = prediction.description.split(',')[0].trim();
          return {
            id: prediction.place_id,
            name: cityName,
            type: 'city',
          };
        },
      );

      setCitySuggestions(places);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = async (place: Place) => {
    try {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );

      placesService.getDetails(
        { placeId: place.id },
        (placeDetails: GooglePlaceDetails | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            placeDetails
          ) {
            setLocation(place.name);
            setCitySearchQuery(place.name);
          }
        },
      );
    } catch (error) {
      console.error('Error fetching place details:', error);
    }

    setCitySuggestions([]);
    setIsCitySearching(false);
  };

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
              <span className="font-medium">{t('where')}:</span> {location}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <span className="font-medium">{t('when')}:</span> {date}
            </span>
          )}
          {artistName && (
            <span className="flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              <span className="font-medium">{t('artist-name')}:</span>{' '}
              {artistName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-colors hover:bg-gray-200 sm:h-8 sm:w-8"
            onClick={() => {
              setLocation('');
              setDate('');
              setTimezone('');
              setArtistName('');
              setCitySearchQuery('');
              setCitySuggestions([]);
              setIsCitySearching(false);
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
            <div className="relative" ref={locationInputRef}>
              <input
                type="text"
                value={isCitySearching ? citySearchQuery : location}
                onChange={(e) => {
                  const value = e.target.value;
                  handleCitySearch(value);
                  setLocation(value);
                }}
                onFocus={() => setIsCitySearching(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsCitySearching(false);
                    setCitySuggestions([]);
                  }, 200);
                }}
                placeholder={t('enter-city-name')}
                className={`w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 ${
                  showValidation &&
                  !location.trim() &&
                  !date.trim() &&
                  !artistName.trim()
                    ? 'placeholder-red-300'
                    : ''
                }`}
              />
              {citySuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  {citySuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleCitySelect(suggestion)}
                    >
                      {suggestion.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
