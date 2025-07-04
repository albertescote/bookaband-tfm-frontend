import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { PerformanceArea } from '@/service/backend/band/domain/bandProfile';
import { useCallback, useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getFormData, setFormData } from '@/utils/formStorage';

interface Region {
  id: string;
  name: string;
  type: 'country' | 'region' | 'province';
  parentId?: string;
}

interface GasPriceCalculation {
  fuelConsumption: number;
  useDynamicPricing: boolean;
  pricePerLiter?: number;
}

interface PerformanceAreaStepProps {
  formData: Partial<UpsertBandRequest>;
  onFormDataChange: (data: Partial<UpsertBandRequest>) => void;
  hasError: boolean;
}

export default function PerformanceAreaStep({
  formData,
  onFormDataChange,
  hasError,
}: PerformanceAreaStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(() => {
    const storedData = getFormData();
    if (storedData?.performanceArea?.regionDetails) {
      return storedData.performanceArea.regionDetails;
    }

    if (formData.performanceArea?.regions) {
      const regions = formData.performanceArea.regions;
      if (Array.isArray(regions)) {
        return regions.map((region) => {
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
    }
    return [];
  });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isGasPriceEnabled, setIsGasPriceEnabled] = useState(() => {
    const storedData = getFormData();
    return (
      storedData?.performanceArea?.gasPriceCalculation ??
      formData.performanceArea?.gasPriceCalculation ??
      false
    );
  });
  const [gasPriceCalculation, setGasPriceCalculation] =
    useState<GasPriceCalculation>(() => {
      const storedData = getFormData();
      if (storedData?.performanceArea?.gasPriceCalculation) {
        return storedData.performanceArea.gasPriceCalculation;
      }
      return {
        fuelConsumption:
          formData.performanceArea?.gasPriceCalculation?.fuelConsumption ?? 0,
        useDynamicPricing:
          formData.performanceArea?.gasPriceCalculation?.useDynamicPricing ??
          true,
        pricePerLiter:
          formData.performanceArea?.gasPriceCalculation?.pricePerLiter,
      };
    });

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const storedData = getFormData() || {};
    const updatedData = {
      ...storedData,
      performanceArea: {
        ...storedData.performanceArea,
        regions: selectedRegions.map((region) => region.id),
        regionDetails: selectedRegions,
        gasPriceCalculation: isGasPriceEnabled
          ? gasPriceCalculation
          : undefined,
        otherComments: formData.performanceArea?.otherComments || '',
      },
    };

    setFormData(updatedData);
  }, [
    selectedRegions,
    isGasPriceEnabled,
    gasPriceCalculation,
    formData.performanceArea?.otherComments,
  ]);

  useEffect(() => {
    const performanceArea: PerformanceArea = {
      regions: selectedRegions.map((region) => region.id),
      gasPriceCalculation: isGasPriceEnabled ? gasPriceCalculation : undefined,
      otherComments: formData.performanceArea?.otherComments || '',
    };

    onFormDataChange({
      ...formData,
      performanceArea,
    });
  }, [
    selectedRegions,
    isGasPriceEnabled,
    gasPriceCalculation,
    formData.performanceArea?.otherComments,
  ]);

  useEffect(() => {
    const fetchRegionDetails = async () => {
      if (!isGoogleMapsLoaded || selectedRegions.length === 0) return;

      const placesService = new google.maps.places.PlacesService(
        document.createElement('div'),
      );

      const updatedRegions = await Promise.all(
        selectedRegions.map(async (region) => {
          if (region.name === region.id) {
            return new Promise<Region>((resolve) => {
              placesService.getDetails(
                { placeId: region.id },
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

      setSelectedRegions(updatedRegions);
    };

    fetchRegionDetails();
  }, [isGoogleMapsLoaded, selectedRegions.length]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim() || !isGoogleMapsLoaded) {
        setSuggestions([]);
        return;
      }

      try {
        const autocompleteService =
          new google.maps.places.AutocompleteService();

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
          language: language,
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
    },
    [isGoogleMapsLoaded, selectedType, language],
  );

  const determineRegionType = (types: string[]): Region['type'] => {
    if (types.includes('country')) return 'country';
    if (types.includes('administrative_area_level_1')) return 'region';
    if (types.includes('administrative_area_level_2')) return 'province';
    return 'region';
  };

  const handleAddRegion = (region: Region) => {
    if (!selectedRegions.some((r) => r.id === region.id)) {
      setSelectedRegions([...selectedRegions, region]);
    }
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleRemoveRegion = (regionId: string) => {
    setSelectedRegions(selectedRegions.filter((r) => r.id !== regionId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const performanceArea: PerformanceArea = {
      regions: selectedRegions.map((region) => region.id),
      gasPriceCalculation: isGasPriceEnabled ? gasPriceCalculation : undefined,
      otherComments:
        name === 'otherComments'
          ? value
          : formData.performanceArea?.otherComments || '',
    };
    onFormDataChange({
      ...formData,
      performanceArea,
    });
  };

  const handleGasPriceChange = (
    field: keyof GasPriceCalculation,
    value: string | number | boolean,
  ) => {
    setGasPriceCalculation((prev) => ({
      ...prev,
      [field]: value === '' ? 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.performanceArea.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.performanceArea.subtitle')}
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t('form.performanceArea.regions.label')} *
          </label>
          <div className="mt-2 space-y-4">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-white">
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
                  className={
                    hasError && selectedRegions.length === 0
                      ? 'border-red-500'
                      : ''
                  }
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
              {selectedRegions.map((region) => (
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

            {hasError && selectedRegions.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                {t('form.performanceArea.regions.required')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="gas-price-enabled"
            className="text-sm font-medium text-gray-700"
          >
            {t('form.performanceArea.gasPrice.enableLabel')}
          </Label>
          <Switch
            id="gas-price-enabled"
            checked={isGasPriceEnabled}
            onCheckedChange={setIsGasPriceEnabled}
          />
        </div>

        {isGasPriceEnabled && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
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
                      value={gasPriceCalculation.fuelConsumption || ''}
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
                      className={`pr-12 ${
                        hasError &&
                        (!gasPriceCalculation.fuelConsumption ||
                          gasPriceCalculation.fuelConsumption <= 0)
                          ? 'border-red-500'
                          : ''
                      }`}
                      placeholder="0.0"
                    />
                  </div>
                  {hasError &&
                    (!gasPriceCalculation.fuelConsumption ||
                      gasPriceCalculation.fuelConsumption <= 0) && (
                      <p className="text-xs text-red-500">
                        {t(
                          'form.performanceArea.gasPrice.fuelConsumptionRequired',
                        )}
                      </p>
                    )}
                  <p className="text-xs text-gray-500">
                    {t('form.performanceArea.gasPrice.fuelConsumptionHelp')}
                  </p>
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
                        gasPriceCalculation.useDynamicPricing
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
                        !gasPriceCalculation.useDynamicPricing
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('form.performanceArea.gasPrice.staticPricing')}
                    </button>
                  </div>
                </div>
              </div>

              {!gasPriceCalculation.useDynamicPricing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('form.performanceArea.gasPrice.staticPricePerLiter')}
                    </label>
                    <span className="text-xs text-gray-500">€/L</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={gasPriceCalculation.pricePerLiter || ''}
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
                      className={`pr-12 ${
                        hasError && !gasPriceCalculation.pricePerLiter
                          ? 'border-red-500'
                          : ''
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('form.performanceArea.gasPrice.staticPriceHelp')}
                  </p>
                </div>
              )}

              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      {gasPriceCalculation.useDynamicPricing
                        ? t('form.performanceArea.gasPrice.dynamicDescription')
                        : t('form.performanceArea.gasPrice.staticDescription')}
                    </p>
                  </div>
                </div>
              </div>

              {hasError &&
                (!gasPriceCalculation.fuelConsumption ||
                  (!gasPriceCalculation.useDynamicPricing &&
                    !gasPriceCalculation.pricePerLiter)) && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('validation.required')}
                  </p>
                )}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="otherComments"
            className="text-sm font-medium text-gray-700"
          >
            {t('form.performanceArea.otherComments.label')}
          </label>
          <div className="mt-2">
            <Textarea
              id="otherComments"
              name="otherComments"
              value={formData.performanceArea?.otherComments || ''}
              onChange={handleInputChange}
              placeholder={t('form.performanceArea.otherComments.placeholder')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
