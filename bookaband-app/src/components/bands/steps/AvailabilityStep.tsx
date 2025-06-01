import React from 'react';
import { useTranslation } from 'react-i18next';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';

interface AvailabilityStepProps {
  formData: Partial<UpsertBandRequest>;
  onUpdate: (data: Partial<UpsertBandRequest>) => void;
  onError: (error: boolean) => void;
}

export function AvailabilityStep({
  formData,
  onUpdate,
  onError,
}: AvailabilityStepProps) {
  const { t } = useTranslation('bands');

  const handleDayToggle = (day: keyof BandProfile['weeklyAvailability']) => {
    const currentAvailability = formData.weeklyAvailability || {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };

    const newAvailability = {
      ...currentAvailability,
      [day]: !currentAvailability[day],
    };

    // Check if at least one day is selected
    const hasSelectedDay = Object.values(newAvailability).some(
      (available) => available,
    );
    onError(!hasSelectedDay);

    onUpdate({ weeklyAvailability: newAvailability });
  };

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('form.availability.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('form.availability.description')}
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center space-y-6"
      >
        <div className="grid w-full max-w-7xl grid-cols-7 gap-4">
          {days.map((day) => (
            <motion.div
              key={day}
              variants={item}
              className="flex flex-col items-center space-y-2"
            >
              <button
                type="button"
                onClick={() => handleDayToggle(day)}
                className={cn(
                  'h-24 w-32 rounded-xl border-2 transition-all duration-200',
                  'flex items-center justify-center text-lg font-medium',
                  'hover:scale-105 hover:shadow-md active:scale-95',
                  formData.weeklyAvailability?.[day]
                    ? 'border-[#15b7b9] bg-[#15b7b9] text-white shadow-md'
                    : 'bg-white hover:border-[#15b7b9]/50',
                )}
              >
                {t(`form.availability.days.${day}`)}
              </button>
            </motion.div>
          ))}
        </div>

        {!Object.values(formData.weeklyAvailability || {}).some(
          (available) => available,
        ) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-center text-sm"
          >
            {t('form.availability.error')}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
