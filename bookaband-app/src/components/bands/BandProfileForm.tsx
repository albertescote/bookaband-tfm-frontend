'use client';

import { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { BandProfile } from '@/service/backend/band/domain/bandProfile';
import BandCreationLayout from './BandCreationLayout';
import BasicInfoStep from './steps/BasicInfoStep';
import TechnicalRiderStep from './steps/TechnicalRiderStep';
import HospitalityRiderStep from './steps/HospitalityRiderStep';
import PerformanceAreaStep from './steps/PerformanceAreaStep';
import AvailabilityStep from './steps/AvailabilityStep';
import MultimediaStep from './steps/MultimediaStep';

interface BandProfileFormProps {
  onSubmit: (data: BandProfile) => Promise<void>;
}

const TOTAL_STEPS = 6;

export default function BandProfileForm({ onSubmit }: BandProfileFormProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BandProfile>>({});

  const handleNext = async () => {
    if (currentStep === TOTAL_STEPS) {
      setIsSubmitting(true);
      setError(null);

      try {
        const data: BandProfile = {
          id: '', // Will be set by the backend
          name: formData.name || '',
          location: formData.location || '',
          description: formData.description || '',
          musicalStyles: formData.musicalStyles || [],
          members: [], // TODO: Implement member management
          technicalRider: formData.technicalRider || {
            soundSystem: [],
            microphones: [],
            backline: [],
            lighting: [],
            otherRequirements: [],
          },
          hospitalityRider: formData.hospitalityRider || {
            accommodation: [],
            catering: [],
            beverages: [],
            specialRequirements: [],
          },
          performanceArea: formData.performanceArea || {
            regions: [],
            travelPreferences: [],
            restrictions: [],
          },
          availability: formData.availability || [],
          rates: [], // TODO: Implement rates management
          multimediaContent: {
            images: [],
            videos: [],
          },
          socialMedia: formData.socialMedia || {
            instagram: '',
            facebook: '',
            tiktok: '',
            website: '',
          },
          legalDocuments: [], // TODO: Implement document management
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await onSubmit(data);
      } catch (error) {
        console.error('Error submitting form:', error);
        setError(t('errorCreating'));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFormDataChange = (data: Partial<BandProfile>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 2:
        return (
          <TechnicalRiderStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 3:
        return (
          <HospitalityRiderStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 4:
        return (
          <PerformanceAreaStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 5:
        return (
          <AvailabilityStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 6:
        return (
          <MultimediaStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BandCreationLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={handleBack}
      isSubmitting={isSubmitting}
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {renderStep()}
    </BandCreationLayout>
  );
}
