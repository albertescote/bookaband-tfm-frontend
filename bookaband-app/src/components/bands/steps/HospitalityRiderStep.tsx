import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import {
  BandProfile,
  HospitalityRider,
} from '@/service/backend/band/domain/bandProfile';
import { Textarea } from '@/components/ui/textarea';

interface HospitalityRiderStepProps {
  formData: Partial<BandProfile>;
  onFormDataChange: (data: Partial<BandProfile>) => void;
  hasError: boolean;
}

export default function HospitalityRiderStep({
  formData,
  onFormDataChange,
  hasError,
}: HospitalityRiderStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (field: keyof HospitalityRider, value: string) => {
    onFormDataChange({
      ...formData,
      hospitalityRider: {
        accommodation:
          field === 'accommodation'
            ? value.split('\n').filter(Boolean)
            : formData.hospitalityRider?.accommodation || [],
        catering:
          field === 'catering'
            ? value.split('\n').filter(Boolean)
            : formData.hospitalityRider?.catering || [],
        beverages:
          field === 'beverages'
            ? value.split('\n').filter(Boolean)
            : formData.hospitalityRider?.beverages || [],
        specialRequirements:
          field === 'specialRequirements'
            ? value.split('\n').filter(Boolean)
            : formData.hospitalityRider?.specialRequirements || [],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.hospitalityRider.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.hospitalityRider.subtitle')}
        </p>
      </div>
      <div>
        <label
          htmlFor="accommodation"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.hospitalityRider.accommodation.label')} *
        </label>
        <Textarea
          id="accommodation"
          value={formData.hospitalityRider?.accommodation?.join('\n') || ''}
          onChange={(e) => handleInputChange('accommodation', e.target.value)}
          placeholder={t('form.hospitalityRider.accommodation.placeholder')}
          className={
            hasError &&
            (!formData.hospitalityRider?.accommodation ||
              formData.hospitalityRider.accommodation.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.hospitalityRider?.accommodation ||
            formData.hospitalityRider.accommodation.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label htmlFor="catering" className="text-sm font-medium text-gray-700">
          {t('form.hospitalityRider.catering.label')} *
        </label>
        <Textarea
          id="catering"
          value={formData.hospitalityRider?.catering?.join('\n') || ''}
          onChange={(e) => handleInputChange('catering', e.target.value)}
          placeholder={t('form.hospitalityRider.catering.placeholder')}
          className={
            hasError &&
            (!formData.hospitalityRider?.catering ||
              formData.hospitalityRider.catering.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.hospitalityRider?.catering ||
            formData.hospitalityRider.catering.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="beverages"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.hospitalityRider.beverages.label')} *
        </label>
        <Textarea
          id="beverages"
          value={formData.hospitalityRider?.beverages?.join('\n') || ''}
          onChange={(e) => handleInputChange('beverages', e.target.value)}
          placeholder={t('form.hospitalityRider.beverages.placeholder')}
          className={
            hasError &&
            (!formData.hospitalityRider?.beverages ||
              formData.hospitalityRider.beverages.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.hospitalityRider?.beverages ||
            formData.hospitalityRider.beverages.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="specialRequirements"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.hospitalityRider.specialRequirements.label')}
        </label>
        <Textarea
          id="specialRequirements"
          value={
            formData.hospitalityRider?.specialRequirements?.join('\n') || ''
          }
          onChange={(e) =>
            handleInputChange('specialRequirements', e.target.value)
          }
          placeholder={t(
            'form.hospitalityRider.specialRequirements.placeholder',
          )}
        />
      </div>
    </div>
  );
}
