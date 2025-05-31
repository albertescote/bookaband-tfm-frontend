import { ReactNode } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface BandCreationLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const STEPS: Step[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Band details and description',
  },
  {
    id: 'technical-rider',
    title: 'Technical Rider',
    description: 'Equipment and technical requirements',
  },
  {
    id: 'hospitality-rider',
    title: 'Hospitality Rider',
    description: 'Accommodation and catering needs',
  },
  {
    id: 'performance-area',
    title: 'Performance Area',
    description: 'Regions and travel preferences',
  },
  {
    id: 'availability',
    title: 'Availability',
    description: 'Available dates and rates',
  },
  {
    id: 'multimedia',
    title: 'Multimedia',
    description: 'Images, videos and social media',
  },
];

export default function BandCreationLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isSubmitting = false,
}: BandCreationLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleBack = () => {
    if (currentStep > 1) {
      onBack();
    } else {
      router.push('/bands');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 -ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {t('back')}
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index + 1 === currentStep
                      ? 'text-[#15b7b9]'
                      : index + 1 < currentStep
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      index + 1 === currentStep
                        ? 'border-[#15b7b9] bg-[#15b7b9] text-white'
                        : index + 1 < currentStep
                        ? 'border-gray-500 bg-gray-500 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className="text-xs">{step.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 shadow-sm rounded-lg">
          {children}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="bg-white border-t rounded-b-lg">
          <div className="px-6 py-4">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {currentStep === 1 ? t('cancel') : t('previous')}
              </Button>
              <Button
                type="button"
                onClick={onNext}
                disabled={isSubmitting}
                className="bg-[#15b7b9] hover:bg-[#15b7b9]/90"
              >
                {currentStep === totalSteps ? t('create') : t('next')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 