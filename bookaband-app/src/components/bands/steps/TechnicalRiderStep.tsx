import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import {
  BandProfile,
  TechnicalRider,
} from '@/service/backend/band/domain/bandProfile';
import { Textarea } from '@/components/ui/textarea';

interface TechnicalRiderStepProps {
  formData: Partial<BandProfile>;
  onFormDataChange: (data: Partial<BandProfile>) => void;
  hasError: boolean;
}

export default function TechnicalRiderStep({
  formData,
  onFormDataChange,
  hasError,
}: TechnicalRiderStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleInputChange = (field: keyof TechnicalRider, value: string) => {
    onFormDataChange({
      ...formData,
      technicalRider: {
        soundSystem:
          field === 'soundSystem'
            ? value.split('\n').filter(Boolean)
            : formData.technicalRider?.soundSystem || [],
        microphones:
          field === 'microphones'
            ? value.split('\n').filter(Boolean)
            : formData.technicalRider?.microphones || [],
        backline:
          field === 'backline'
            ? value.split('\n').filter(Boolean)
            : formData.technicalRider?.backline || [],
        lighting:
          field === 'lighting'
            ? value.split('\n').filter(Boolean)
            : formData.technicalRider?.lighting || [],
        otherRequirements:
          field === 'otherRequirements'
            ? value.split('\n').filter(Boolean)
            : formData.technicalRider?.otherRequirements || [],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.technicalRider.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.technicalRider.subtitle')}
        </p>
      </div>
      <div>
        <label
          htmlFor="soundSystem"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.technicalRider.soundSystem.label')} *
        </label>
        <Textarea
          id="soundSystem"
          value={formData.technicalRider?.soundSystem?.join('\n') || ''}
          onChange={(e) => handleInputChange('soundSystem', e.target.value)}
          placeholder={t('form.technicalRider.soundSystem.placeholder')}
          className={
            hasError &&
            (!formData.technicalRider?.soundSystem ||
              formData.technicalRider.soundSystem.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.technicalRider?.soundSystem ||
            formData.technicalRider.soundSystem.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="microphones"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.technicalRider.microphones.label')} *
        </label>
        <Textarea
          id="microphones"
          value={formData.technicalRider?.microphones?.join('\n') || ''}
          onChange={(e) => handleInputChange('microphones', e.target.value)}
          placeholder={t('form.technicalRider.microphones.placeholder')}
          className={
            hasError &&
            (!formData.technicalRider?.microphones ||
              formData.technicalRider.microphones.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.technicalRider?.microphones ||
            formData.technicalRider.microphones.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label htmlFor="backline" className="text-sm font-medium text-gray-700">
          {t('form.technicalRider.backline.label')} *
        </label>
        <Textarea
          id="backline"
          value={formData.technicalRider?.backline?.join('\n') || ''}
          onChange={(e) => handleInputChange('backline', e.target.value)}
          placeholder={t('form.technicalRider.backline.placeholder')}
          className={
            hasError &&
            (!formData.technicalRider?.backline ||
              formData.technicalRider.backline.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.technicalRider?.backline ||
            formData.technicalRider.backline.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label htmlFor="lighting" className="text-sm font-medium text-gray-700">
          {t('form.technicalRider.lighting.label')} *
        </label>
        <Textarea
          id="lighting"
          value={formData.technicalRider?.lighting?.join('\n') || ''}
          onChange={(e) => handleInputChange('lighting', e.target.value)}
          placeholder={t('form.technicalRider.lighting.placeholder')}
          className={
            hasError &&
            (!formData.technicalRider?.lighting ||
              formData.technicalRider.lighting.length === 0)
              ? 'border-red-500'
              : ''
          }
        />
        {hasError &&
          (!formData.technicalRider?.lighting ||
            formData.technicalRider.lighting.length === 0) && (
            <p className="mt-1 text-sm text-red-500">
              {t('validation.required')}
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="otherRequirements"
          className="text-sm font-medium text-gray-700"
        >
          {t('form.technicalRider.otherRequirements.label')}
        </label>
        <Textarea
          id="otherRequirements"
          value={formData.technicalRider?.otherRequirements?.join('\n') || ''}
          onChange={(e) =>
            handleInputChange('otherRequirements', e.target.value)
          }
          placeholder={t('form.technicalRider.otherRequirements.placeholder')}
        />
      </div>
    </div>
  );
}
