import { PerformanceArea } from '@/service/backend/band/domain/bandProfile';
import { CollapsibleSection } from './CollapsibleSection';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface PerformanceAreaSectionProps {
  performanceArea: PerformanceArea;
  isEditing: boolean;
  onUpdate: (area: PerformanceArea) => void;
  t: (key: string) => string;
}

export function PerformanceAreaSection({
  performanceArea,
  isEditing,
  onUpdate,
  t,
}: PerformanceAreaSectionProps) {
  const [newRegion, setNewRegion] = useState('');

  const handleChange = (
    field: keyof PerformanceArea,
    value: string | string[],
  ) => {
    onUpdate({
      ...performanceArea,
      [field]: value,
    });
  };

  const handleAddRegion = () => {
    if (newRegion.trim()) {
      const currentRegions = performanceArea.regions || [];
      handleChange('regions', [...currentRegions, newRegion.trim()]);
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (index: number) => {
    const currentRegions = performanceArea.regions || [];
    handleChange(
      'regions',
      currentRegions.filter((_, i) => i !== index),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRegion();
    }
  };

  return (
    <CollapsibleSection title={t('form.performanceArea.title')}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.performanceArea.regions.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('form.performanceArea.regions.placeholder')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleAddRegion}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={t('form.performanceArea.regions.add')}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {performanceArea.regions?.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    <span>{region}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRegion(index)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${region}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {performanceArea.regions?.map((region, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {region}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.performanceArea.travelPreferences.label')}
            {isEditing && <span className="text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={performanceArea.travelPreferences}
                onChange={(e) =>
                  handleChange('travelPreferences', e.target.value)
                }
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t(
                  'form.performanceArea.travelPreferences.placeholder',
                )}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {performanceArea.travelPreferences}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.performanceArea.restrictions.label')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={performanceArea.restrictions}
                onChange={(e) => handleChange('restrictions', e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                rows={3}
                placeholder={t('form.performanceArea.restrictions.placeholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">
                {performanceArea.restrictions}
              </p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
