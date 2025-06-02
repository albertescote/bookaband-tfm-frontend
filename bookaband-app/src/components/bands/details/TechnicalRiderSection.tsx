import { TechnicalRider } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';

interface TechnicalRiderSectionProps {
  technicalRider: TechnicalRider;
  isEditing: boolean;
  onUpdate: (rider: TechnicalRider) => void;
  t: (key: string) => string;
}

export function TechnicalRiderSection({
  technicalRider,
  isEditing,
  onUpdate,
  t,
}: TechnicalRiderSectionProps) {
  const handleChange = (field: keyof TechnicalRider, value: string) => {
    onUpdate({
      ...technicalRider,
      [field]: value,
    });
  };

  return (
    <CollapsibleSection title={t('form.technicalRider.title')}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.soundSystem.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={technicalRider.soundSystem}
                onChange={(e) => handleChange('soundSystem', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.technicalRider.soundSystem.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {technicalRider.soundSystem}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.microphones.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={technicalRider.microphones}
                onChange={(e) => handleChange('microphones', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.technicalRider.microphones.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {technicalRider.microphones}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.backline.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={technicalRider.backline}
                onChange={(e) => handleChange('backline', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.technicalRider.backline.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {technicalRider.backline}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.lighting.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={technicalRider.lighting}
                onChange={(e) => handleChange('lighting', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.technicalRider.lighting.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {technicalRider.lighting}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.otherRequirements.label')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={technicalRider.otherRequirements}
                onChange={(e) =>
                  handleChange('otherRequirements', e.target.value)
                }
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t(
                  'form.technicalRider.otherRequirements.placeholder',
                )}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {technicalRider.otherRequirements}
              </p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
