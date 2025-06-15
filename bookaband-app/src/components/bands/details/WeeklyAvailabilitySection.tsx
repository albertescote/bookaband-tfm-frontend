import { motion } from 'framer-motion';
import { CollapsibleSection } from './CollapsibleSection';

type WeeklyAvailability = {
  [key in
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday']: boolean;
};

interface WeeklyAvailabilitySectionProps {
  availability: WeeklyAvailability;
  isEditing: boolean;
  onToggleDay: (day: keyof WeeklyAvailability) => void;
  t: (key: string) => string;
  hasError?: boolean;
}

export function WeeklyAvailabilitySection({
  availability,
  isEditing,
  onToggleDay,
  t,
  hasError,
}: WeeklyAvailabilitySectionProps) {
  const hasSelectedDays = Object.values(availability).some(
    (isAvailable) => isAvailable,
  );

  return (
    <CollapsibleSection
      title={t('form.availability.title')}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {(
            [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ] as const
          ).map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              onClick={() => onToggleDay(day)}
              disabled={!isEditing}
              className={`rounded-lg p-4 text-center transition-colors ${
                availability[day]
                  ? 'bg-[#15b7b9] text-white'
                  : 'bg-gray-100 text-gray-500'
              } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:bg-opacity-90'}`}
            >
              {t(`form.availability.days.${day}`)}
            </motion.button>
          ))}
        </div>
        {hasError && !hasSelectedDays && (
          <p className="text-sm text-red-500">
            {t('validation.availability.required')}
          </p>
        )}
      </div>
    </CollapsibleSection>
  );
}
