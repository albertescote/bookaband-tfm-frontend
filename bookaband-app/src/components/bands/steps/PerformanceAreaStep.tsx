import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import {
  BandProfile,
  PerformanceArea,
} from '@/service/backend/band/domain/bandProfile';
import { Textarea } from '@/components/ui/textarea';

interface PerformanceAreaStepProps {
  formData: Partial<BandProfile>;
  onFormDataChange: (data: Partial<BandProfile>) => void;
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

  const handleInputChange = (field: keyof PerformanceArea, value: string) => {
    onFormDataChange({
      ...formData,
      performanceArea: {
        regions:
          field === 'regions'
            ? value.split('\n').filter(Boolean)
            : formData.performanceArea?.regions || [],
        travelPreferences:
          field === 'travelPreferences'
            ? value.split('\n').filter(Boolean)
            : formData.performanceArea?.travelPreferences || [],
        restrictions:
          field === 'restrictions'
            ? value.split('\n').filter(Boolean)
            : formData.performanceArea?.restrictions || [],
      },
    });
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
        <Textarea
          id="regions"
          value={formData.performanceArea?.regions?.join('\n') || ''}
          onChange={(e) => handleInputChange('regions', e.target.value)}
          placeholder={t('form.performanceArea.regions.placeholder')}
          className={
            hasError &&
            (!formData.performanceArea?.regions ||
              formData.performanceArea.regions.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.performanceArea?.regions ||
            formData.performanceArea.regions.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="travelPreferences"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.performanceArea.travelPreferences.label')} *
        </label>
        <Textarea
          id="travelPreferences"
          value={formData.performanceArea?.travelPreferences?.join('\n') || ''}
          onChange={(e) =>
            handleInputChange('travelPreferences', e.target.value)
          }
          placeholder={t('form.performanceArea.travelPreferences.placeholder')}
          className={
            hasError &&
            (!formData.performanceArea?.travelPreferences ||
              formData.performanceArea.travelPreferences.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.performanceArea?.travelPreferences ||
            formData.performanceArea.travelPreferences.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="restrictions"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.performanceArea.restrictions.label')}
        </label>
        <Textarea
          id="restrictions"
          value={formData.performanceArea?.restrictions?.join('\n') || ''}
          onChange={(e) => handleInputChange('restrictions', e.target.value)}
          placeholder={t('form.performanceArea.restrictions.placeholder')}
        />
      </div>
    </div>
  );
}
