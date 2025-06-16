import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import { CollapsibleSection } from './CollapsibleSection';
import { useCallback, useEffect, useRef, useState } from 'react';

interface BasicInfoSectionProps {
  initialLocation: string;
  location: string;
  musicalStyles: MusicalStyle[];
  selectedMusicalStyleIds: string[];
  eventTypes: EventType[];
  selectedEventTypeIds: string[];
  bandSize: string;
  bio: string;
  price: number;
  isEditing: boolean;
  language: string;
  onLocationChange: (value: string) => void;
  onMusicalStylesChange: (value: string[]) => void;
  onEventTypesChange: (value: string[]) => void;
  onBandSizeChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  t: (key: string) => string;
  hasError?: {
    location?: boolean;
    price?: boolean;
    musicalStyles?: boolean;
    eventTypes?: boolean;
    bandSize?: boolean;
  };
}

export function BasicInfoSection({
  initialLocation,
  location,
  musicalStyles,
  selectedMusicalStyleIds,
  eventTypes,
  selectedEventTypeIds,
  bandSize,
  bio,
  price,
  isEditing,
  language,
  onLocationChange,
  onMusicalStylesChange,
  onEventTypesChange,
  onBandSizeChange,
  onBioChange,
  onPriceChange,
  t,
  hasError,
}: BasicInfoSectionProps) {
  const [searchQuery, setSearchQuery] = useState(location || '');
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      onLocationChange(initialLocation);
      setSearchQuery(query);
      if (!query.trim() || !isGoogleMapsLoaded) {
        setSuggestions([]);
        onLocationChange('');
        return;
      }

      try {
        const autocompleteService =
          new google.maps.places.AutocompleteService();
        const request = {
          input: query,
          types: ['geocode'],
          componentRestrictions: { country: [] },
          language: language,
        };

        const response = await autocompleteService.getPlacePredictions(request);
        const places = response.predictions.map((prediction) => ({
          id: prediction.place_id,
          name: prediction.description,
        }));

        setSuggestions(places);
      } catch (error) {
        console.error('Error fetching places:', error);
        setSuggestions([]);
      }
    },
    [isGoogleMapsLoaded, language, onLocationChange],
  );

  const handlePlaceSelect = (place: { id: string; name: string }) => {
    onLocationChange(place.name);
    setSearchQuery(place.name);
    setSuggestions([]);
  };

  return (
    <CollapsibleSection title={t('form.basicInfo.title')} defaultOpen={true}>
      <div className="space-y-6">
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.location')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
              ref={locationRef}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full rounded-lg border ${
                  hasError?.location ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-3 pl-10 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
                placeholder={t('form.basicInfo.location')}
              />
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => handlePlaceSelect(suggestion)}
                    >
                      {suggestion.name}
                    </button>
                  ))}
                </div>
              )}
              {hasError?.location && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{location}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.price')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <input
                type="number"
                min="1"
                step="1"
                value={price || ''}
                onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
                className={`w-full rounded-lg border ${
                  hasError?.price ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
                placeholder={t('form.basicInfo.pricePlaceholder')}
                onKeyPress={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
              />
              {hasError?.price && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-gray-900">{price} €</span>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.musicalStyles')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MultiSelect
                options={musicalStyles.map((style) => ({
                  label: style.label[language] || style.label['en'],
                  value: style.id,
                  icon: style.icon,
                }))}
                value={selectedMusicalStyleIds}
                onChange={onMusicalStylesChange}
                placeholder={t('form.basicInfo.musicalStylesPlaceholder')}
                className={`w-full ${
                  hasError?.musicalStyles ? 'border-red-500' : ''
                }`}
              />
              {hasError?.musicalStyles && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {selectedMusicalStyleIds.map((styleId) => {
                const style = musicalStyles.find((s) => s.id === styleId);
                return (
                  <span
                    key={styleId}
                    className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-sm text-[#15b7b9]"
                  >
                    {style?.icon && <span>{style.icon}</span>}
                    <span>
                      {style?.label[language] || style?.label['en'] || styleId}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.eventTypes')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MultiSelect
                options={eventTypes.map((type) => ({
                  label: type.label[language] || type.label['en'],
                  value: type.id,
                  icon: type.icon,
                }))}
                value={selectedEventTypeIds}
                onChange={onEventTypesChange}
                placeholder={t('form.basicInfo.eventTypesPlaceholder')}
                className={`w-full ${
                  hasError?.eventTypes ? 'border-red-500' : ''
                }`}
              />
              {hasError?.eventTypes && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {selectedEventTypeIds.map((typeId) => {
                const type = eventTypes.find((t) => t.id === typeId);
                return (
                  <span
                    key={typeId}
                    className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-sm text-[#15b7b9]"
                  >
                    {type?.icon && <span>{type.icon}</span>}
                    <span>
                      {type?.label[language] || type?.label['en'] || typeId}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.bandSize')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <select
                value={bandSize}
                onChange={(e) => onBandSizeChange(e.target.value)}
                className={`w-full appearance-none rounded-lg border ${
                  hasError?.bandSize ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
              >
                <option value="SOLO">
                  {t('form.basicInfo.bandSizes.SOLO')}
                </option>
                <option value="DUO">{t('form.basicInfo.bandSizes.DUO')}</option>
                <option value="TRIO">
                  {t('form.basicInfo.bandSizes.TRIO')}
                </option>
                <option value="BAND">
                  {t('form.basicInfo.bandSizes.BAND')}
                </option>
              </select>
              {hasError?.bandSize && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">
                {t(`form.basicInfo.bandSizes.${bandSize}`)}
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.biography')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={bio}
                onChange={(e) => onBioChange(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                placeholder={t('form.basicInfo.biographyPlaceholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">{bio}</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
