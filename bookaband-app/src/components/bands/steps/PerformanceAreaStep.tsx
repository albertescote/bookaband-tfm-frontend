import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

interface PerformanceAreaStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
}

export default function PerformanceAreaStep({
  formData,
  onFormDataChange,
}: PerformanceAreaStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      performanceArea: {
        ...formData.performanceArea,
        [name]: [value],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('regions')}
          </label>
          <Textarea
            name="regions"
            value={formData.performanceArea?.regions?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('regionsPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('travelPreferences')}
          </label>
          <Textarea
            name="travelPreferences"
            value={formData.performanceArea?.travelPreferences?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('travelPreferencesPlaceholder')}
            rows={3}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('restrictions')}
          </label>
          <Textarea
            name="restrictions"
            value={formData.performanceArea?.restrictions?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('restrictionsPlaceholder')}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
} 