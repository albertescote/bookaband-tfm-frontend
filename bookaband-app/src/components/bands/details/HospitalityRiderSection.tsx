import { HospitalityRider } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';

interface HospitalityRiderSectionProps {
  hospitalityRider: HospitalityRider;
  isEditing: boolean;
  onUpdate: (rider: HospitalityRider) => void;
  t: (key: string) => string;
}

export function HospitalityRiderSection({
  hospitalityRider,
  isEditing,
  onUpdate,
  t,
}: HospitalityRiderSectionProps) {
  const handleChange = (field: keyof HospitalityRider, value: string) => {
    onUpdate({
      ...hospitalityRider,
      [field]: value,
    });
  };

  return (
    <CollapsibleSection title={t('form.hospitalityRider.title')}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.accommodation.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={hospitalityRider.accommodation}
                onChange={(e) => handleChange('accommodation', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t(
                  'form.hospitalityRider.accommodation.placeholder',
                )}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {hospitalityRider.accommodation}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.catering.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={hospitalityRider.catering}
                onChange={(e) => handleChange('catering', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.hospitalityRider.catering.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {hospitalityRider.catering}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.beverages.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={hospitalityRider.beverages}
                onChange={(e) => handleChange('beverages', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.hospitalityRider.beverages.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {hospitalityRider.beverages}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.hospitalityRider.specialRequirements.label')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
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
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {hospitalityRider.specialRequirements}
              </p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
