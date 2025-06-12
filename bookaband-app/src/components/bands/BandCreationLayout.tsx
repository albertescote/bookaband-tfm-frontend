import { ReactNode } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Step {
  id: string;
  titleKey: string;
}

interface BandCreationLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onStepClick: (step: number) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const STEPS: Step[] = [
  {
    id: 'basic-info',
    titleKey: 'progress.steps.basicInfo.title',
  },
  {
    id: 'technical-rider',
    titleKey: 'progress.steps.technicalRider.title',
  },
  {
    id: 'hospitality-rider',
    titleKey: 'progress.steps.hospitalityRider.title',
  },
  {
    id: 'performance-area',
    titleKey: 'progress.steps.performanceArea.title',
  },
  {
    id: 'availability',
    titleKey: 'progress.steps.availability.title',
  },
  {
    id: 'multimedia',
    titleKey: 'progress.steps.multimedia.title',
  },
];

export default function BandCreationLayout({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onStepClick,
  onCancel,
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
      onCancel();
      router.push(`/${language}/bands`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="-ml-2 flex items-center gap-2 text-gray-600 hover:text-gray-900"
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
                  onClick={() =>
                    index + 1 <= currentStep && onStepClick(index + 1)
                  }
                  className={`flex flex-col items-center transition-colors duration-200 ${
                    index + 1 === currentStep
                      ? 'text-[#15b7b9]'
                      : index + 1 < currentStep
                        ? 'cursor-pointer text-gray-500 hover:text-[#15b7b9]'
                        : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      index + 1 === currentStep
                        ? 'border-[#15b7b9] bg-[#15b7b9] text-white shadow-md'
                        : index + 1 < currentStep
                          ? 'cursor-pointer border-gray-500 bg-gray-500 text-white hover:border-[#15b7b9] hover:bg-[#15b7b9]'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">
                    {t(step.titleKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={
                currentStep === 1
                  ? () => {
                      onCancel();
                      router.push(`/${language}/bands`);
                    }
                  : handleBack
              }
              disabled={isSubmitting}
              className="border-gray-200 hover:bg-gray-50"
            >
              {currentStep === 1 ? t('common.cancel') : t('common.previous')}
            </Button>

            <div className="text-sm text-gray-500">
              {currentStep} / {totalSteps}
            </div>

            <Button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="bg-[#15b7b9] text-white shadow-sm hover:bg-[#15b7b9]/90"
            >
              {currentStep === totalSteps ? t('create') : t('common.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
