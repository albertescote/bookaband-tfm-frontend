import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { HospitalityRider } from '@/service/backend/band/domain/bandProfile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface HospitalityRiderStepProps {
  formData: Partial<UpsertBandRequest>;
  onFormDataChange: (data: Partial<UpsertBandRequest>) => void;
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
  const [isEnabled, setIsEnabled] = useState(
    Boolean(formData.hospitalityRider),
  );

  useEffect(() => {
    setIsEnabled(Boolean(formData.hospitalityRider));
  }, [formData.hospitalityRider]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const hospitalityRider: HospitalityRider = {
      accommodation:
        name === 'accommodation'
          ? value
          : formData.hospitalityRider?.accommodation || '',
      catering:
        name === 'catering' ? value : formData.hospitalityRider?.catering || '',
      beverages:
        name === 'beverages'
          ? value
          : formData.hospitalityRider?.beverages || '',
      specialRequirements:
        name === 'specialRequirements'
          ? value
          : formData.hospitalityRider?.specialRequirements || '',
    };
    const updatedFormData = {
      ...formData,
      hospitalityRider,
    };
    onFormDataChange(updatedFormData);
    localStorage.setItem('bandFormData', JSON.stringify(updatedFormData));
  };

  const handleHospitalityRiderToggle = (checked: boolean) => {
    setIsEnabled(checked);
    let updatedFormData: Partial<UpsertBandRequest>;

    if (checked) {
      updatedFormData = {
        ...formData,
        hospitalityRider: {
          accommodation: '',
          catering: '',
          beverages: '',
          specialRequirements: '',
        },
      };
    } else {
      const { hospitalityRider, ...rest } = formData;
      updatedFormData = rest;
    }

    onFormDataChange(updatedFormData);
    localStorage.setItem('bandFormData', JSON.stringify(updatedFormData));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('form.hospitalityRider.title')}
          </h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="hospitality-rider-toggle" className="text-sm">
              {isEnabled
                ? t('form.hospitalityRider.disable')
                : t('form.hospitalityRider.enable')}
            </Label>
            <Switch
              id="hospitality-rider-toggle"
              checked={isEnabled}
              onCheckedChange={handleHospitalityRiderToggle}
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          {t('form.hospitalityRider.subtitle')}
        </p>
      </div>

      {isEnabled && (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="accommodation"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.hospitalityRider.accommodation.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="accommodation"
                name="accommodation"
                value={formData.hospitalityRider?.accommodation || ''}
                onChange={handleInputChange}
                placeholder={t(
                  'form.hospitalityRider.accommodation.placeholder',
                )}
                className={
                  hasError && !formData.hospitalityRider?.accommodation
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.hospitalityRider?.accommodation && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="catering"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.hospitalityRider.catering.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="catering"
                name="catering"
                value={formData.hospitalityRider?.catering || ''}
                onChange={handleInputChange}
                placeholder={t('form.hospitalityRider.catering.placeholder')}
                className={
                  hasError && !formData.hospitalityRider?.catering
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.hospitalityRider?.catering && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="beverages"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.hospitalityRider.beverages.label')} *
            </label>
            <div className="mt-2">
              <Textarea
                id="beverages"
                name="beverages"
                value={formData.hospitalityRider?.beverages || ''}
                onChange={handleInputChange}
                placeholder={t('form.hospitalityRider.beverages.placeholder')}
                className={
                  hasError && !formData.hospitalityRider?.beverages
                    ? 'border-red-500'
                    : ''
                }
              />
              {hasError && !formData.hospitalityRider?.beverages && (
                <p className="mt-1 text-sm text-red-500">
                  {t('validation.required')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="specialRequirements"
              className="text-sm font-medium text-gray-700"
            >
              {t('form.hospitalityRider.specialRequirements.label')}
            </label>
            <div className="mt-2">
              <Textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.hospitalityRider?.specialRequirements || ''}
                onChange={handleInputChange}
                placeholder={t(
                  'form.hospitalityRider.specialRequirements.placeholder',
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
