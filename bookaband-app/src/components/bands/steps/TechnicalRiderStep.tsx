import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { TechnicalRider } from '@/service/backend/band/domain/bandProfile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { setFormData } from '@/utils/formStorage';

interface TechnicalRiderStepProps {
  formData: Partial<UpsertBandRequest>;
  onFormDataChange: (data: Partial<UpsertBandRequest>) => void;
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
  const [isEnabled, setIsEnabled] = useState(Boolean(formData.technicalRider));

  useEffect(() => {
    setIsEnabled(Boolean(formData.technicalRider));
  }, [formData.technicalRider]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const technicalRider: TechnicalRider = {
      soundSystem:
        name === 'soundSystem'
          ? value
          : formData.technicalRider?.soundSystem || '',
      microphones:
        name === 'microphones'
          ? value
          : formData.technicalRider?.microphones || '',
      backline:
        name === 'backline' ? value : formData.technicalRider?.backline || '',
      lighting:
        name === 'lighting' ? value : formData.technicalRider?.lighting || '',
      otherRequirements:
        name === 'otherRequirements'
          ? value
          : formData.technicalRider?.otherRequirements || '',
    };
    const updatedFormData = {
      ...formData,
      technicalRider,
    };
    onFormDataChange(updatedFormData);
    setFormData(updatedFormData);
  };

  const handleTechnicalRiderToggle = (checked: boolean) => {
    setIsEnabled(checked);
    let updatedFormData: Partial<UpsertBandRequest>;

    if (checked) {
      updatedFormData = {
        ...formData,
        technicalRider: {
          soundSystem: '',
          microphones: '',
          backline: '',
          lighting: '',
          otherRequirements: '',
        },
      };
    } else {
      const { technicalRider, ...rest } = formData;
      updatedFormData = rest;
    }

    onFormDataChange(updatedFormData);
    setFormData(updatedFormData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('form.technicalRider.title')}
          </h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="technical-rider-toggle" className="text-sm">
              {isEnabled
                ? t('form.technicalRider.disable')
                : t('form.technicalRider.enable')}
            </Label>
            <Switch
              id="technical-rider-toggle"
              checked={isEnabled}
              onCheckedChange={handleTechnicalRiderToggle}
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          {t('form.technicalRider.subtitle')}
        </p>
      </div>

      {isEnabled && (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="soundSystem"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.technicalRider.soundSystem.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="soundSystem"
                name="soundSystem"
                value={formData.technicalRider?.soundSystem || ''}
                onChange={handleInputChange}
                placeholder={t('form.technicalRider.soundSystem.placeholder')}
                className={
                  hasError && !formData.technicalRider?.soundSystem
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.technicalRider?.soundSystem && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="microphones"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.technicalRider.microphones.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="microphones"
                name="microphones"
                value={formData.technicalRider?.microphones || ''}
                onChange={handleInputChange}
                placeholder={t('form.technicalRider.microphones.placeholder')}
                className={
                  hasError && !formData.technicalRider?.microphones
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.technicalRider?.microphones && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="backline"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.technicalRider.backline.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="backline"
                name="backline"
                value={formData.technicalRider?.backline || ''}
                onChange={handleInputChange}
                placeholder={t('form.technicalRider.backline.placeholder')}
                className={
                  hasError && !formData.technicalRider?.backline
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.technicalRider?.backline && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lighting"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.technicalRider.lighting.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="lighting"
                name="lighting"
                value={formData.technicalRider?.lighting || ''}
                onChange={handleInputChange}
                placeholder={t('form.technicalRider.lighting.placeholder')}
                className={
                  hasError && !formData.technicalRider?.lighting
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.technicalRider?.lighting && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="otherRequirements"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.technicalRider.otherRequirements.label')}
            </label>
            <div className="mt-2">
              <Textarea
                id="otherRequirements"
                name="otherRequirements"
                value={formData.technicalRider?.otherRequirements || ''}
                onChange={handleInputChange}
                placeholder={t(
                  'form.technicalRider.otherRequirements.placeholder',
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
