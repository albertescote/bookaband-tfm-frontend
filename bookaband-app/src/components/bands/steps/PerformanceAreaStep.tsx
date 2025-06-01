import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { PerformanceArea } from '@/service/backend/band/domain/bandProfile';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

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
  const [newRegion, setNewRegion] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const performanceArea: PerformanceArea = {
      regions: formData.performanceArea?.regions || [],
      travelPreferences:
        name === 'travelPreferences'
          ? value
          : formData.performanceArea?.travelPreferences || '',
      restrictions:
        name === 'restrictions'
          ? value
          : formData.performanceArea?.restrictions || '',
    };
    onFormDataChange({
      ...formData,
      performanceArea,
    });
  };

  const handleAddRegion = () => {
    if (newRegion.trim()) {
      const currentRegions = formData.performanceArea?.regions || [];
      const performanceArea: PerformanceArea = {
        regions: [...currentRegions, newRegion.trim()],
        travelPreferences: formData.performanceArea?.travelPreferences || '',
        restrictions: formData.performanceArea?.restrictions || '',
      };
      onFormDataChange({
        ...formData,
        performanceArea,
      });
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (index: number) => {
    const currentRegions = formData.performanceArea?.regions || [];
    const performanceArea: PerformanceArea = {
      regions: currentRegions.filter((_, i) => i !== index),
      travelPreferences: formData.performanceArea?.travelPreferences || '',
      restrictions: formData.performanceArea?.restrictions || '',
    };
    onFormDataChange({
      ...formData,
      performanceArea,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRegion();
    }
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

      <div>
        <label htmlFor="regions" className="text-sm font-medium text-gray-700">
          {t('form.performanceArea.regions.label')} *
        </label>
        <div className="mt-2">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="regions"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('form.performanceArea.regions.placeholder')}
                  className={
                    hasError &&
                    (!formData.performanceArea?.regions ||
                      formData.performanceArea.regions.length === 0)
                      ? 'border-red-500 pr-10'
                      : 'pr-10'
                  }
                  aria-label={t('form.performanceArea.regions.label')}
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
              {formData.performanceArea?.regions?.map((region, index) => (
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
            {hasError &&
              (!formData.performanceArea?.regions ||
                formData.performanceArea.regions.length === 0) && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="travelPreferences"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.performanceArea.travelPreferences.label')} *
        </label>
        <div className="mt-2">
          <Textarea
            id="travelPreferences"
            name="travelPreferences"
            value={formData.performanceArea?.travelPreferences || ''}
            onChange={handleInputChange}
            placeholder={t('form.performanceArea.travelPreferences.placeholder')}
            className={
              hasError && !formData.performanceArea?.travelPreferences
                ? 'border-red-500'
                : ''
            }
          />
          {hasError && !formData.performanceArea?.travelPreferences && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="restrictions"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.performanceArea.restrictions.label')}
        </label>
        <div className="mt-2">
          <Textarea
            id="restrictions"
            name="restrictions"
            value={formData.performanceArea?.restrictions || ''}
            onChange={handleInputChange}
            placeholder={t('form.performanceArea.restrictions.placeholder')}
          />
        </div>
      </div>
    </div>
  );
}
