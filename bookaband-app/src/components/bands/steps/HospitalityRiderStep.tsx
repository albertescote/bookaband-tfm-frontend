import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

interface HospitalityRiderStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
}

export default function HospitalityRiderStep({
  formData,
  onFormDataChange,
}: HospitalityRiderStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      hospitalityRider: {
        ...formData.hospitalityRider,
        [name]: [value],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('accommodation')}
          </label>
          <Textarea
            name="accommodation"
            value={formData.hospitalityRider?.accommodation?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('accommodationPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('catering')}
          </label>
          <Textarea
            name="catering"
            value={formData.hospitalityRider?.catering?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('cateringPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('beverages')}
          </label>
          <Textarea
            name="beverages"
            value={formData.hospitalityRider?.beverages?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('beveragesPlaceholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('specialRequirements')}
          </label>
          <Textarea
            name="specialRequirements"
            value={formData.hospitalityRider?.specialRequirements?.[0] || ''}
            onChange={handleInputChange}
            placeholder={t('specialRequirementsPlaceholder')}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
} 