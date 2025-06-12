import React, { useEffect, useState } from 'react';
import { Euro, Music, PartyPopper, Star, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { BandSize } from '@/service/backend/artist/domain/bandSize';
import * as Slider from '@radix-ui/react-slider';
import { useAuth } from '@/providers/authProvider';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/filters/domain/eventType';

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
    selectedGenres?: string[];
    selectedBandSize?: BandSize | string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  musicalStyles: MusicalStyle[];
  initialEventTypes: EventType[];
}

interface Sections {
  genre: boolean;
  bandSize: boolean;
  ratings: boolean;
  eventType: boolean;
  price: boolean;
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

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  language,
  onFilterChange,
  musicalStyles,
  initialEventTypes,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedBandSize, setSelectedBandSize] = useState<BandSize | ''>('');

  const [eventTypes, setEventTypes] = useState<Record<string, boolean>>({});
  const [eventTypeItems, setEventTypeItems] = useState<EventTypeItem[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expanded, setExpanded] = useState<Sections>({
    genre: true,
    bandSize: false,
    ratings: true,
    eventType: false,
    price: false,
  });

  const handleRatingChange = (newRating: number) => {
    const finalRating = rating === newRating ? 0 : newRating;
    setRating(finalRating);
    onFilterChange({ minRating: finalRating });
  };

  const handleGenreChange = (genreId: string) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(newGenres);
    onFilterChange({ selectedGenres: newGenres });
  };

  const handleBandSizeChange = (size: BandSize) => {
    const newSize = selectedBandSize === size ? '' : size;
    setSelectedBandSize(newSize);
    onFilterChange({ selectedBandSize: newSize });
  };

  const handleEventTypeChange = (key: string, checked: boolean) => {
    const newEventTypes = { ...eventTypes, [key]: checked };
    setEventTypes(newEventTypes);
    onFilterChange({ eventTypes: newEventTypes });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    onFilterChange({ minPrice: values[0], maxPrice: values[1] });
  };

  const toggleSection = (section: keyof Sections) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const bandSizes = [
    { value: BandSize.SOLO, label: 'Solo', count: 1 },
    { value: BandSize.DUO, label: 'Duo', count: 2 },
    { value: BandSize.TRIO, label: 'Trio', count: 3 },
    { value: BandSize.BAND, label: 'Band (4+)', count: 4 },
  ];

  useEffect(() => {
    const mappedItems: EventTypeItem[] = initialEventTypes.map((item: any) => ({
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
      <div className="space-y-4">
        <FilterHeader
          icon={<Music className="h-5 w-5 text-[#15b7b9]" />}
          title={t('genre')}
          section="genre"
        />

        {expanded.genre && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {musicalStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleGenreChange(style.id)}
                className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedGenres.includes(style.id)
                    ? 'bg-[#15b7b9] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{style.icon}</span>
                <span>{style.label[language] || style.label['en']}</span>
              </button>
            ))}
          </div>
        )}
      </div>

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

      {user && (
        <div className="space-y-4">
          <FilterHeader
            icon={<Euro className="h-5 w-5 text-[#15b7b9]" />}
            title={t('price-range')}
            section="price"
          />

          {expanded.price && (
            <div className="space-y-4 px-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                step={10}
                minStepsBetweenThumbs={1}
              >
                <Slider.Track className="relative h-1 grow rounded-full bg-gray-200">
                  <Slider.Range className="absolute h-full rounded-full bg-[#15b7b9]" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-4 w-4 rounded-full border-2 border-[#15b7b9] bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  aria-label="Minimum price"
                />
                <Slider.Thumb
                  className="block h-4 w-4 rounded-full border-2 border-[#15b7b9] bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  aria-label="Maximum price"
                />
              </Slider.Root>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t('applied-filters') || 'Applied Filters'}
          </h3>
          <button
            onClick={() => {
              setRating(0);
              setSelectedGenres([]);
              setSelectedBandSize('');
              setPriceRange([0, 10000]);

              const resetEventTypes = Object.keys(eventTypes).reduce(
                (acc, key) => ({ ...acc, [key]: false }),
                {},
              );
              setEventTypes(resetEventTypes);

              onFilterChange({
                minRating: undefined,
                selectedGenres: undefined,
                selectedBandSize: undefined,
                eventTypes: undefined,
                minPrice: undefined,
                maxPrice: undefined,
              });
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

            {selectedGenres.map((genreId) => {
              const style = musicalStyles.find((s) => s.id === genreId);
              return style ? (
                <div
                  key={genreId}
                  className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]"
                >
                  <span>
                    {style.icon} {style.label[language] || style.label['en']}
                  </span>
                  <button
                    onClick={() => handleGenreChange(genreId)}
                    className="ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : null;
            })}

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

            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <div className="flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs text-[#15b7b9]">
                <span>
                  {priceRange[0]}€ — {priceRange[1]}€
                </span>
                <button
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    onFilterChange({
                      minPrice: undefined,
                      maxPrice: undefined,
                    });
                  }}
                  className="ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {!rating &&
              !selectedGenres.length &&
              !selectedBandSize &&
              !Object.values(eventTypes).some(Boolean) &&
              priceRange[0] === 0 &&
              priceRange[1] === 1000 && (
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
