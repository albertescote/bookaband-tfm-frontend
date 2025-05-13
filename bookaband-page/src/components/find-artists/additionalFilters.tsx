import React, { useEffect, useState } from 'react';
import { Mic, Music, PartyPopper, Star, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';

interface AdditionalFiltersProps {
  language: string;
  onFilterChange: (filters: {
    minRating?: number;
    hasSoundEquipment?: boolean;
    hasLighting?: boolean;
    hasMicrophone?: boolean;
    eventTypes?: {
      weddings?: boolean;
      privateParties?: boolean;
      festivals?: boolean;
      restaurantsHotels?: boolean;
      businesses?: boolean;
    };
    selectedGenre?: string;
    selectedBandSize?: string;
  }) => void;
}

interface Sections {
  genre: boolean;
  bandSize: boolean;
  ratings: boolean;
  equipment: boolean;
  eventType: boolean;
}

interface FilterHeaderProps {
  icon: React.ReactNode;
  title: string;
  section: keyof Sections;
}

type EventTypeKey =
  | 'weddings'
  | 'privateParties'
  | 'festivals'
  | 'restaurantsHotels'
  | 'businesses';

interface EventTypeItem {
  id: EventTypeKey;
  label: string;
  icon: React.ReactNode;
}

type EquipmentTypeKey = 'hasSoundEquipment' | 'hasLighting' | 'hasMicrophone';

interface EquipmentTypeItem {
  id: EquipmentTypeKey;
  label: string;
  icon: React.ReactNode;
}

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  language,
  onFilterChange,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedBandSize, setSelectedBandSize] = useState('');
  const [equipmentFilters, setEquipmentFilters] = useState({
    hasSoundEquipment: false,
    hasLighting: false,
    hasMicrophone: false,
  });
  const [eventTypes, setEventTypes] = useState<Record<string, boolean>>({});
  const [eventTypeItems, setEventTypeItems] = useState<EventTypeItem[]>([]);
  const [expanded, setExpanded] = useState<Sections>({
    genre: true,
    bandSize: false,
    ratings: true,
    equipment: false,
    eventType: false,
  });

  const handleRatingChange = (newRating: number) => {
    const finalRating = rating === newRating ? 0 : newRating; // Toggle off if already selected
    setRating(finalRating);
    onFilterChange({ minRating: finalRating });
  };

  const handleGenreChange = (genre: string) => {
    const newGenre = selectedGenre === genre ? '' : genre; // Toggle off if already selected
    setSelectedGenre(newGenre);
    onFilterChange({ selectedGenre: newGenre });
  };

  const handleBandSizeChange = (size: string) => {
    const newSize = selectedBandSize === size ? '' : size; // Toggle off if already selected
    setSelectedBandSize(newSize);
    onFilterChange({ selectedBandSize: newSize });
  };

  const handleEquipmentChange = (key: string, checked: boolean) => {
    const newEquipmentFilters = { ...equipmentFilters, [key]: checked };
    setEquipmentFilters(newEquipmentFilters);
    onFilterChange(newEquipmentFilters);
  };

  const handleEventTypeChange = (key: string, checked: boolean) => {
    const newEventTypes = { ...eventTypes, [key]: checked };
    setEventTypes(newEventTypes);
    onFilterChange({ eventTypes: newEventTypes });
  };

  const toggleSection = (section: keyof Sections) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const genres = [
    { value: 'rock', label: 'Rock', emoji: '🎸' },
    { value: 'pop', label: 'Pop', emoji: '🎤' },
    { value: 'jazz', label: 'Jazz', emoji: '🎷' },
    { value: 'classical', label: 'Classical', emoji: '🎻' },
    { value: 'electronic', label: 'Electronic', emoji: '🎧' },
  ];

  const bandSizes = [
    { value: 'solo', label: 'Solo', count: 1 },
    { value: 'duo', label: 'Duo', count: 2 },
    { value: 'trio', label: 'Trio', count: 3 },
    { value: 'band', label: 'Band (4+)', count: 4 },
  ];

  const equipmentItems: EquipmentTypeItem[] = [
    { id: 'hasSoundEquipment', label: t('sound-equipment'), icon: '🔊' },
    { id: 'hasLighting', label: t('lighting'), icon: '💡' },
    { id: 'hasMicrophone', label: t('microphone'), icon: '🎤' },
  ];

  useEffect(() => {
    fetchEventTypes().then((data) => {
      if ('error' in data) return;

      const mappedItems: EventTypeItem[] = data.map((item: any) => ({
        id: item.id,
        label: item.label[language] || item.label['en'],
        icon: item.icon,
      }));

      setEventTypeItems(mappedItems);

      const initialStates = mappedItems.reduce(
        (acc, item) => ({ ...acc, [item.id]: false }),
        {},
      );
      setEventTypes(initialStates);
    });
  }, [language]);

  const FilterHeader: React.FC<FilterHeaderProps> = ({
    icon,
    title,
    section,
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-all hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div
        className={`transform text-gray-500 transition-transform duration-200 ${expanded[section] ? 'rotate-180' : 'rotate-0'}`}
      >
        <svg
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L6 5L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Genre Filter */}
      <div className="space-y-4">
        <FilterHeader
          icon={<Music className="h-5 w-5 text-[#15b7b9]" />}
          title={t('genre')}
          section="genre"
        />

        {expanded.genre && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {genres.map((genre) => (
              <button
                key={genre.value}
                onClick={() => handleGenreChange(genre.value)}
                className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedGenre === genre.value
                    ? 'bg-[#15b7b9] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{genre.emoji}</span>
                <span>{genre.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <FilterHeader
          icon={<Star className="h-5 w-5 text-[#15b7b9]" />}
          title={t('ratings')}
          section="ratings"
        />

        {expanded.ratings && (
          <div className="flex items-center justify-center py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-all"
              >
                <Star
                  className={`h-6 w-6 transition-all ${
                    (hoveredRating > 0 ? hoveredRating >= star : rating >= star)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Band Size Filter */}
      <div className="space-y-4">
        <FilterHeader
          icon={<Music className="h-5 w-5 text-[#15b7b9]" />}
          title={t('band-size')}
          section="bandSize"
        />

        {expanded.bandSize && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {bandSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => handleBandSizeChange(size.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedBandSize === size.value
                    ? 'bg-[#15b7b9] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Available Equipment */}
      <div className="space-y-4">
        <FilterHeader
          icon={<Mic className="h-5 w-5 text-[#15b7b9]" />}
          title={t('available-equipment')}
          section="equipment"
        />

        {expanded.equipment && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('equipment-note')}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
              {equipmentItems.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    equipmentFilters[item.id]
                      ? 'bg-[#15b7b9] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={equipmentFilters[item.id] || false}
                    onChange={(e) =>
                      handleEquipmentChange(item.id, e.target.checked)
                    }
                  />
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Type of Event */}
      <div className="space-y-4">
        <FilterHeader
          icon={<PartyPopper className="h-5 w-5 text-[#15b7b9]" />}
          title={t('event-type')}
          section="eventType"
        />

        {expanded.eventType && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{t('event-type-note')}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
              {eventTypeItems.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    eventTypes[item.id]
                      ? 'bg-[#15b7b9] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={eventTypes[item.id] || false}
                    onChange={(e) =>
                      handleEventTypeChange(item.id, e.target.checked)
                    }
                  />
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Applied Filters Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t('applied-filters') || 'Applied Filters'}
          </h3>
          <button
            onClick={() => {
              setRating(0);
              setSelectedGenre('');
              setSelectedBandSize('');
              setEquipmentFilters({
                hasSoundEquipment: false,
                hasLighting: false,
                hasMicrophone: false,
              });

              const resetEventTypes = Object.keys(eventTypes).reduce(
                (acc, key) => ({ ...acc, [key]: false }),
                {},
              );
              setEventTypes(resetEventTypes);

              onFilterChange({});
            }}
            className="text-sm font-medium text-[#15b7b9] hover:underline"
          >
            {t('reset-all') || 'Reset All'}
          </button>
        </div>

        <div className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-2 sm:max-h-16">
          <div className="flex flex-wrap gap-2">
            {rating > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]">
                <span>
                  {rating} {rating === 1 ? t('star') : t('stars')}
                </span>
                <button onClick={() => handleRatingChange(0)} className="ml-1">
                  <X size={12} />
                </button>
              </div>
            )}

            {selectedGenre && (
              <div className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]">
                <span>
                  {genres.find((g) => g.value === selectedGenre)?.emoji}{' '}
                  {genres.find((g) => g.value === selectedGenre)?.label}
                </span>
                <button
                  onClick={() => handleGenreChange(selectedGenre)}
                  className="ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {selectedBandSize && (
              <div className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]">
                <span>
                  {bandSizes.find((b) => b.value === selectedBandSize)?.label}
                </span>
                <button
                  onClick={() => handleBandSizeChange(selectedBandSize)}
                  className="ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {Object.entries(equipmentFilters).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]"
                  >
                    <span>
                      {equipmentItems.find((item) => item.id === key)?.icon}{' '}
                      {equipmentItems.find((item) => item.id === key)?.label}
                    </span>
                    <button
                      onClick={() => handleEquipmentChange(key, false)}
                      className="ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ),
            )}

            {Object.entries(eventTypes).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]"
                  >
                    <span>
                      {eventTypeItems.find((item) => item.id === key)?.icon}{' '}
                      {eventTypeItems.find((item) => item.id === key)?.label}
                    </span>
                    <button
                      onClick={() => handleEventTypeChange(key, false)}
                      className="ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ),
            )}

            {!rating &&
              !selectedGenre &&
              !selectedBandSize &&
              !Object.values(equipmentFilters).some(Boolean) &&
              !Object.values(eventTypes).some(Boolean) && (
                <div className="text-xs italic text-gray-500">
                  {t('no-filters') || 'No filters applied'}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFilters;
