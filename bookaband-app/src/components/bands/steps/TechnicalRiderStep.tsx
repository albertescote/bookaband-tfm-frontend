import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

interface TechnicalRiderStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
}

export default function TechnicalRiderStep({
  formData,
  onFormDataChange,
}: TechnicalRiderStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      technicalRider: {
        ...formData.technicalRider,
        [name]: [value],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('soundSystem')}
          </label>
          <Textarea
            name="soundSystem"
            value={formData.technicalRider?.soundSystem?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('soundSystemPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('microphones')}
          </label>
          <Textarea
            name="microphones"
            value={formData.technicalRider?.microphones?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('microphonesPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('backline')}
          </label>
          <Textarea
            name="backline"
            value={formData.technicalRider?.backline?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('backlinePlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('lighting')}
          </label>
          <Textarea
            name="lighting"
            value={formData.technicalRider?.lighting?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('lightingPlaceholder')}
            rows={3}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('otherRequirements')}
          </label>
          <Textarea
            name="otherRequirements"
            value={formData.technicalRider?.otherRequirements?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('otherRequirementsPlaceholder')}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
} 