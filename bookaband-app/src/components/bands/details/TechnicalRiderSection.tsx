import { TechnicalRider } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

interface TechnicalRiderSectionProps {
  technicalRider?: TechnicalRider;
  isEditing: boolean;
  onUpdate: (rider: TechnicalRider | undefined) => void;
  t: (key: string) => string;
}

export function TechnicalRiderSection({
  technicalRider,
  isEditing,
  onUpdate,
  t,
}: TechnicalRiderSectionProps) {
  const handleChange = (field: keyof TechnicalRider, value: string) => {
    const updatedRider: TechnicalRider = {
      soundSystem:
        field === 'soundSystem' ? value : technicalRider?.soundSystem || '',
      microphones:
        field === 'microphones' ? value : technicalRider?.microphones || '',
      backline: field === 'backline' ? value : technicalRider?.backline || '',
      lighting: field === 'lighting' ? value : technicalRider?.lighting || '',
      otherRequirements:
        field === 'otherRequirements'
          ? value
          : technicalRider?.otherRequirements || '',
    };
    onUpdate(updatedRider);
  };

  const handleToggleRider = (enabled: boolean) => {
    if (enabled) {
      onUpdate({
        soundSystem: '',
        microphones: '',
        backline: '',
        lighting: '',
        otherRequirements: '',
      });
    } else {
      onUpdate(undefined);
    }
  };

  if (!isEditing) {
    if (!technicalRider) {
      return (
        <CollapsibleSection title={t('form.technicalRider.title')}>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-gray-500">{t('form.technicalRider.noRider')}</p>
          </div>
        </CollapsibleSection>
      );
    }
  } else {
    return (
      <CollapsibleSection title={t('form.technicalRider.title')}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-700">
                {technicalRider
                  ? t('form.technicalRider.enable')
                  : t('form.technicalRider.disable')}
              </label>
            </div>
            <Switch
              checked={!!technicalRider}
              onCheckedChange={handleToggleRider}
            />
          </div>

          {technicalRider && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.technicalRider.soundSystem.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={technicalRider.soundSystem}
                  onChange={(e) => handleChange('soundSystem', e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  rows={3}
                  placeholder={t('form.technicalRider.soundSystem.placeholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.technicalRider.microphones.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={technicalRider.microphones}
                  onChange={(e) => handleChange('microphones', e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  rows={3}
                  placeholder={t('form.technicalRider.microphones.placeholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.technicalRider.backline.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={technicalRider.backline}
                  onChange={(e) => handleChange('backline', e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  rows={3}
                  placeholder={t('form.technicalRider.backline.placeholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.technicalRider.lighting.label')}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={technicalRider.lighting}
                  onChange={(e) => handleChange('lighting', e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                  rows={3}
                  placeholder={t('form.technicalRider.lighting.placeholder')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('form.technicalRider.otherRequirements.label')}
                </label>
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
              </div>
            </motion.div>
          )}
        </div>
      </CollapsibleSection>
    );
  }

  return (
    <CollapsibleSection title={t('form.technicalRider.title')}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.soundSystem.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {technicalRider.soundSystem}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.microphones.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {technicalRider.microphones}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.backline.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {technicalRider.backline}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.lighting.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {technicalRider.lighting}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.technicalRider.otherRequirements.label')}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-gray-900">
              {technicalRider.otherRequirements}
            </p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
