import { PerformanceArea } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Info, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PerformanceAreaSectionProps {
  performanceArea: PerformanceArea;
  isEditing: boolean;
  onUpdate: (area: PerformanceArea) => void;
  t: (key: string) => string;
}

export function PerformanceAreaSection({
  performanceArea,
  isEditing,
  onUpdate,
  t,
}: PerformanceAreaSectionProps) {
  const [newRegion, setNewRegion] = useState('');

  const handleChange = (
    field: keyof PerformanceArea,
    value: string | string[] | PerformanceArea['gasPriceCalculation'],
  ) => {
    onUpdate({
      ...performanceArea,
      [field]: value,
    });
  };

  const handleAddRegion = () => {
    if (newRegion.trim()) {
      const currentRegions: string[] = Array.isArray(performanceArea.regions)
        ? (performanceArea.regions.filter(
            (region) => typeof region === 'string',
          ) as string[])
        : [];
      handleChange('regions', [...currentRegions, newRegion.trim()]);
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (index: number) => {
    const currentRegions: string[] = Array.isArray(performanceArea.regions)
      ? (performanceArea.regions.filter(
          (region) => typeof region === 'string',
        ) as string[])
      : [];
    handleChange(
      'regions',
      currentRegions.filter((_, i) => i !== index),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRegion();
    }
  };

  const handleGasPriceChange = (
    field: keyof NonNullable<PerformanceArea['gasPriceCalculation']>,
    value: string | number | boolean,
  ) => {
    const currentGasPrice = performanceArea.gasPriceCalculation || {
      fuelConsumption: 0,
      useDynamicPricing: true,
    };

    handleChange('gasPriceCalculation', {
      ...currentGasPrice,
      [field]: value === '' ? 0 : value,
    });
  };

  const handleToggleGasPrice = (enabled: boolean) => {
    if (enabled) {
      handleChange('gasPriceCalculation', {
        fuelConsumption: 0,
        useDynamicPricing: true,
      });
    } else {
      handleChange('gasPriceCalculation', undefined);
    }
  };

  const regions: string[] = Array.isArray(performanceArea.regions)
    ? (performanceArea.regions.filter(
        (region) => typeof region === 'string',
      ) as string[])
    : [];

  return (
    <CollapsibleSection title={t('form.performanceArea.title')}>
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t(
                      'form.performanceArea.regions.searchPlaceholder',
                    )}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleAddRegion}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={t('form.performanceArea.regions.add')}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {regions.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    <span>{region}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRegion(index)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${region}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {regions.map((region, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {region}
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
                          className="pr-12"
                          placeholder="0.0"
                        />
                      </div>
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
                          className="pr-12"
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
                onChange={(e) => handleChange('otherComments', e.target.value)}
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
