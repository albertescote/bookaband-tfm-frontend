import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import { CollapsibleSection } from './CollapsibleSection';

interface BasicInfoSectionProps {
  location: string;
  musicalStyles: MusicalStyle[];
  selectedMusicalStyleIds: string[];
  eventTypes: EventType[];
  selectedEventTypeIds: string[];
  bandSize: string;
  bio: string;
  isEditing: boolean;
  language: string;
  onLocationChange: (value: string) => void;
  onMusicalStylesChange: (value: string[]) => void;
  onEventTypesChange: (value: string[]) => void;
  onBandSizeChange: (value: string) => void;
  onBioChange: (value: string) => void;
  t: (key: string) => string;
}

export function BasicInfoSection({
  location,
  musicalStyles,
  selectedMusicalStyleIds,
  eventTypes,
  selectedEventTypeIds,
  bandSize,
  bio,
  isEditing,
  language,
  onLocationChange,
  onMusicalStylesChange,
  onEventTypesChange,
  onBandSizeChange,
  onBioChange,
  t,
}: BasicInfoSectionProps) {
  return (
    <CollapsibleSection title={t('form.basicInfo.title')} defaultOpen={true}>
      <div className="space-y-6">
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.location')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <input
                type="text"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                placeholder={t('form.basicInfo.location')}
              />
              <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{location}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.musicalStyles')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MultiSelect
                options={musicalStyles.map((style) => ({
                  label: style.label[language] || style.label['en'],
                  value: style.id,
                  icon: style.icon,
                }))}
                value={selectedMusicalStyleIds}
                onChange={onMusicalStylesChange}
                placeholder={t('form.basicInfo.musicalStylesPlaceholder')}
                className="w-full"
              />
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {selectedMusicalStyleIds.map((styleId) => {
                const style = musicalStyles.find((s) => s.id === styleId);
                return (
                  <span
                    key={styleId}
                    className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-sm text-[#15b7b9]"
                  >
                    {style?.icon && <span>{style.icon}</span>}
                    <span>
                      {style?.label[language] || style?.label['en'] || styleId}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.eventTypes')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <MultiSelect
                options={eventTypes.map((type) => ({
                  label: type.label[language] || type.label['en'],
                  value: type.id,
                  icon: type.icon,
                }))}
                value={selectedEventTypeIds}
                onChange={onEventTypesChange}
                placeholder={t('form.basicInfo.eventTypesPlaceholder')}
                className="w-full"
              />
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {selectedEventTypeIds.map((typeId) => {
                const type = eventTypes.find((t) => t.id === typeId);
                return (
                  <span
                    key={typeId}
                    className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-sm text-[#15b7b9]"
                  >
                    {type?.icon && <span>{type.icon}</span>}
                    <span>
                      {type?.label[language] || type?.label['en'] || typeId}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.bandSize')}
            {isEditing && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <select
                value={bandSize}
                onChange={(e) => onBandSizeChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
              >
                <option value="SOLO">
                  {t('form.basicInfo.bandSizes.SOLO')}
                </option>
                <option value="DUO">{t('form.basicInfo.bandSizes.DUO')}</option>
                <option value="TRIO">
                  {t('form.basicInfo.bandSizes.TRIO')}
                </option>
                <option value="BAND">
                  {t('form.basicInfo.bandSizes.BAND')}
                </option>
              </select>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">
                {t(`form.basicInfo.bandSizes.${bandSize}`)}
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('form.basicInfo.biography')}
          </label>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <textarea
                value={bio}
                onChange={(e) => onBioChange(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                placeholder={t('form.basicInfo.biographyPlaceholder')}
              />
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-gray-900">{bio}</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
