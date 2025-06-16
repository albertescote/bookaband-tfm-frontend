import { PerformanceArea } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/app/i18n/client';

interface Region {
  id: string;
  name: string;
  type: 'country' | 'region' | 'province';
  parentId?: string;
}

interface PerformanceAreaSectionProps {
  performanceArea: PerformanceArea;
  isEditing: boolean;
  onUpdate: (area: PerformanceArea) => void;
  lng: string;
  hasError?: {
    regions?: boolean;
    fuelConsumption?: boolean;
    gasPrice?: boolean;
  };
}

export function PerformanceAreaSection({
  performanceArea,
  isEditing,
  onUpdate,
  lng,
  hasError,
}: PerformanceAreaSectionProps) {
  const { t } = useTranslation(lng, 'bands');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Region[]>([]);
  const [regions, setRegions] = useState<Region[]>(() => {
    if (Array.isArray(performanceArea.regions)) {
      return performanceArea.regions.map((region) => {
        if (typeof region === 'string') {
          return {
            id: region,
            name: region,
            type: 'region',
          };
        }
        return {
          id: region.id,
          name: region.name,
          type: 'region',
        };
      });
    }
    return [];
  });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const fetchRegionDetails = async () => {
      if (!isGoogleMapsLoaded || regions.length === 0) return;

      const placesService = new google.maps.places.PlacesService(
        document.createElement('div'),
      );

      const updatedRegions = await Promise.all(
        regions.map(async (region) => {
          if (region.name === region.id) {
            return new Promise<Region>((resolve) => {
              placesService.getDetails(
                { placeId: region.id, language: lng },
                (place, status) => {
                  if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    place
                  ) {
                    resolve({
                      id: region.id,
                      name: place.name || region.id,
                      type: region.type,
                    });
                  } else {
                    resolve(region);
                  }
                },
              );
            });
          }
          return region;
        }),
      );

      setRegions(updatedRegions);
    };

    fetchRegionDetails();
  }, [isGoogleMapsLoaded, regions.length]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || !isGoogleMapsLoaded) {
      setSuggestions([]);
      return;
    }

    try {
      const autocompleteService = new google.maps.places.AutocompleteService();

      let types: string[] = [];
      switch (selectedType) {
        case 'country':
          types = ['country'];
          break;
        case 'region':
          types = ['administrative_area_level_1'];
          break;
        case 'province':
          types = ['administrative_area_level_2'];
          break;
        default:
          types = ['country'];
          break;
      }

      const request = {
        input: query,
        types: types,
        componentRestrictions: { country: [] },
      };

      const response = await autocompleteService.getPlacePredictions(request);
      const places = response.predictions.map((prediction) => ({
        id: prediction.place_id,
        name: prediction.description,
        type: determineRegionType(prediction.types),
      }));

      setSuggestions(places);
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    }
  };

  const determineRegionType = (types: string[]): Region['type'] => {
    if (types.includes('country')) return 'country';
    if (types.includes('administrative_area_level_1')) return 'region';
    if (types.includes('administrative_area_level_2')) return 'province';
    return 'region';
  };

  const handleAddRegion = (region: Region) => {
    if (!regions.some((r) => r.id === region.id)) {
      const newRegions = [...regions, region];
      setRegions(newRegions);
      onUpdate({
        ...performanceArea,
        regions: newRegions.map((r) => r.id),
      });
    }
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleRemoveRegion = (regionId: string) => {
    const newRegions = regions.filter((r) => r.id !== regionId);
    setRegions(newRegions);
    onUpdate({
      ...performanceArea,
      regions: newRegions.map((r) => r.id),
    });
  };

  const handleGasPriceChange = (
    field: keyof NonNullable<PerformanceArea['gasPriceCalculation']>,
    value: string | number | boolean,
  ) => {
    const currentGasPrice = performanceArea.gasPriceCalculation || {
      fuelConsumption: 0,
      useDynamicPricing: true,
    };

    onUpdate({
      ...performanceArea,
      gasPriceCalculation: {
        ...currentGasPrice,
        [field]: value === '' ? 0 : value,
      },
    });
  };

  const handleToggleGasPrice = (enabled: boolean) => {
    if (enabled) {
      onUpdate({
        ...performanceArea,
        gasPriceCalculation: {
          fuelConsumption: 0,
          useDynamicPricing: true,
        },
      });
    } else {
      onUpdate({
        ...performanceArea,
        gasPriceCalculation: undefined,
      });
    }
  };

  return (
    <CollapsibleSection title={t('form.performanceArea.title')}>
      {isEditing && (
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <div className="flex items-start">
              <Info className="mt-0.5 h-6 w-6 text-blue-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-blue-900">
                {t('form.performanceArea.info.title')}
              </h3>
              <p className="text-sm text-blue-700">
                {t('form.performanceArea.info.description')}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.performanceArea.regions.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger
                  className={`bg-white ${hasError?.regions ? 'border-red-500' : ''}`}
                >
                  <SelectValue
                    placeholder={t('form.performanceArea.regions.selectType')}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="country">
                    {t('form.performanceArea.regions.types.country')}
                  </SelectItem>
                  <SelectItem value="region">
                    {t('form.performanceArea.regions.types.region')}
                  </SelectItem>
                  <SelectItem value="province">
                    {t('form.performanceArea.regions.types.province')}
                  </SelectItem>
                </SelectContent>
              </Select>

              {selectedType && (
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t(
                      'form.performanceArea.regions.searchPlaceholder',
                    )}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => handleAddRegion(suggestion)}
                        >
                          {suggestion.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    <span>{region.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRegion(region.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {hasError?.regions && regions.length === 0 && (
                <p className="text-sm text-red-500">
                  {t('validation.performanceArea.regions.required')}
                </p>
              )}
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {region.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="gas-price-enabled"
                className="text-sm font-medium text-gray-700"
              >
                {t('form.performanceArea.gasPrice.enableLabel')}
              </Label>
              <Switch
                id="gas-price-enabled"
                checked={!!performanceArea.gasPriceCalculation}
                onCheckedChange={handleToggleGasPrice}
              />
            </div>

            {performanceArea.gasPriceCalculation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {t('form.performanceArea.gasPrice.fuelConsumption')} *
                        </label>
                        <span className="text-xs text-gray-500">L/100km</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={
                            performanceArea.gasPriceCalculation
                              .fuelConsumption || ''
                          }
                          onChange={(e) =>
                            handleGasPriceChange(
                              'fuelConsumption',
                              e.target.value === ''
                                ? ''
                                : parseFloat(e.target.value),
                            )
                          }
                          min="0"
                          step="0.1"
                          className={`pr-12 ${hasError?.fuelConsumption ? 'border-red-500' : ''}`}
                          placeholder="0.0"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {t('form.performanceArea.gasPrice.fuelConsumptionHelp')}
                      </p>
                      {hasError?.fuelConsumption &&
                        !performanceArea.gasPriceCalculation
                          .fuelConsumption && (
                          <p className="text-sm text-red-500">
                            {t(
                              'validation.performanceArea.gasPrice.fuelConsumption.required',
                            )}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {t('form.performanceArea.gasPrice.pricingType')}
                        </label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleGasPriceChange('useDynamicPricing', true)
                          }
                          className={`rounded-md px-4 py-2 text-sm font-medium ${
                            performanceArea.gasPriceCalculation
                              .useDynamicPricing
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t('form.performanceArea.gasPrice.dynamicPricing')}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleGasPriceChange('useDynamicPricing', false)
                          }
                          className={`rounded-md px-4 py-2 text-sm font-medium ${
                            !performanceArea.gasPriceCalculation
                              .useDynamicPricing
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t('form.performanceArea.gasPrice.staticPricing')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {!performanceArea.gasPriceCalculation.useDynamicPricing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          {t(
                            'form.performanceArea.gasPrice.staticPricePerLiter',
                          )}
                        </label>
                        <span className="text-xs text-gray-500">€/L</span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={
                            performanceArea.gasPriceCalculation.pricePerLiter ||
                            ''
                          }
                          onChange={(e) =>
                            handleGasPriceChange(
                              'pricePerLiter',
                              e.target.value === ''
                                ? ''
                                : parseFloat(e.target.value),
                            )
                          }
                          min="0"
                          step="0.01"
                          className={`pr-12 ${hasError?.gasPrice ? 'border-red-500' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {t('form.performanceArea.gasPrice.staticPriceHelp')}
                      </p>
                      {hasError?.gasPrice &&
                        !performanceArea.gasPriceCalculation
                          .useDynamicPricing &&
                        !performanceArea.gasPriceCalculation.pricePerLiter && (
                          <p className="text-sm text-red-500">
                            {t(
                              'validation.performanceArea.gasPrice.pricePerLiter.required',
                            )}
                          </p>
                        )}
                    </div>
                  )}

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          {performanceArea.gasPriceCalculation.useDynamicPricing
                            ? t(
                                'form.performanceArea.gasPrice.dynamicDescription',
                              )
                            : t(
                                'form.performanceArea.gasPrice.staticDescription',
                              )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          performanceArea.gasPriceCalculation && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.performanceArea.gasPrice.fuelConsumption')}
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-900">
                    {performanceArea.gasPriceCalculation.fuelConsumption}{' '}
                    L/100km
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.performanceArea.gasPrice.pricingType')}
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-900">
                    {performanceArea.gasPriceCalculation.useDynamicPricing
                      ? t('form.performanceArea.gasPrice.dynamicPricing')
                      : t('form.performanceArea.gasPrice.staticPricing')}
                  </p>
                </div>
              </div>

              {!performanceArea.gasPriceCalculation.useDynamicPricing && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.performanceArea.gasPrice.staticPricePerLiter')}
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-gray-900">
                      {performanceArea.gasPriceCalculation.pricePerLiter} €/L
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.performanceArea.otherComments.label')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={performanceArea.otherComments || ''}
                onChange={(e) =>
                  onUpdate({
                    ...performanceArea,
                    otherComments: e.target.value,
                  })
                }
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t(
                  'form.performanceArea.otherComments.placeholder',
                )}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {performanceArea.otherComments}
              </p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
