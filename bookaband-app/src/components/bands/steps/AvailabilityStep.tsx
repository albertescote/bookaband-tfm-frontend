import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';

interface AvailabilityStepProps {
  formData: any;
  onFormDataChange: (data: any) => void;
}

export default function AvailabilityStep({
  formData,
  onFormDataChange,
}: AvailabilityStepProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const handleDateSelect = (dates: Date[]) => {
    onFormDataChange({
      ...formData,
      availability: dates.map(date => ({
        startDate: date,
        endDate: date,
        isBooked: false,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('availability')}
        </label>
        <Calendar
          selectedDates={formData.availability?.map((a: any) => a.startDate) || []}
          onSelect={handleDateSelect}
        />
      </div>
    </div>
  );
} 