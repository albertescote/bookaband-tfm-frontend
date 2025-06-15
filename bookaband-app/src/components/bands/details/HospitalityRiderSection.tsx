import { HospitalityRider } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

interface HospitalityRiderSectionProps {
  hospitalityRider?: HospitalityRider;
  isEditing: boolean;
  onUpdate: (rider: HospitalityRider | undefined) => void;
  t: (key: string) => string;
  hasError?: boolean;
}

export function HospitalityRiderSection({
  hospitalityRider,
  isEditing,
  onUpdate,
  t,
  hasError,
}: HospitalityRiderSectionProps) {
  const handleChange = (field: keyof HospitalityRider, value: string) => {
    const updatedRider: HospitalityRider = {
      accommodation:
        field === 'accommodation'
          ? value
          : hospitalityRider?.accommodation || '',
      catering: field === 'catering' ? value : hospitalityRider?.catering || '',
      beverages:
        field === 'beverages' ? value : hospitalityRider?.beverages || '',
      specialRequirements:
        field === 'specialRequirements'
          ? value
          : hospitalityRider?.specialRequirements || '',
    };
    onUpdate(updatedRider);
  };

  const handleToggleRider = (enabled: boolean) => {
    if (enabled) {
      onUpdate({
        accommodation: '',
        catering: '',
        beverages: '',
        specialRequirements: '',
      });
    } else {
      onUpdate(undefined);
    }
  };

  if (!isEditing) {
    if (!hospitalityRider) {
      return (
        <CollapsibleSection title={t('form.hospitalityRider.title')}>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-gray-500">
              {t('form.hospitalityRider.noRider')}
            </p>
          </div>
        </CollapsibleSection>
      );
    }
  } else {
    return (
      <CollapsibleSection title={t('form.hospitalityRider.title')}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-700">
                {hospitalityRider
                  ? t('form.hospitalityRider.enable')
                  : t('form.hospitalityRider.disable')}
              </label>
            </div>
            <Switch
              checked={!!hospitalityRider}
              onCheckedChange={handleToggleRider}
            />
          </div>

          {hospitalityRider && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.hospitalityRider.accommodation.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={hospitalityRider.accommodation}
                  onChange={(e) =>
                    handleChange('accommodation', e.target.value)
                  }
                  className={`w-full resize-none rounded-lg border ${
                    hasError && !hospitalityRider.accommodation
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
                  rows={3}
                  placeholder={t(
                    'form.hospitalityRider.accommodation.placeholder',
                  )}
                />
                {hasError && !hospitalityRider.accommodation && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('validation.required')}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.hospitalityRider.catering.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={hospitalityRider.catering}
                  onChange={(e) => handleChange('catering', e.target.value)}
                  className={`w-full resize-none rounded-lg border ${
                    hasError && !hospitalityRider.catering
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
                  rows={3}
                  placeholder={t('form.hospitalityRider.catering.placeholder')}
                />
                {hasError && !hospitalityRider.catering && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('validation.required')}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.hospitalityRider.beverages.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={hospitalityRider.beverages}
                  onChange={(e) => handleChange('beverages', e.target.value)}
                  className={`w-full resize-none rounded-lg border ${
                    hasError && !hospitalityRider.beverages
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20`}
                  rows={3}
                  placeholder={t('form.hospitalityRider.beverages.placeholder')}
                />
                {hasError && !hospitalityRider.beverages && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('validation.required')}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.hospitalityRider.specialRequirements.label')}
                </label>
                <textarea
                  value={hospitalityRider.specialRequirements}
                  onChange={(e) =>
                    handleChange('specialRequirements', e.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  rows={3}
                  placeholder={t(
                    'form.hospitalityRider.specialRequirements.placeholder',
                  )}
                />
              </div>
            </motion.div>
          )}
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection title={t('form.hospitalityRider.title')}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.accommodation.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {hospitalityRider.accommodation}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.catering.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {hospitalityRider.catering}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.beverages.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {hospitalityRider.beverages}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.specialRequirements.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {hospitalityRider.specialRequirements}
            </p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
