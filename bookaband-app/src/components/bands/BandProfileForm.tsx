'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import BandCreationLayout from './BandCreationLayout';
import BasicInfoStep from './steps/BasicInfoStep';
import TechnicalRiderStep from './steps/TechnicalRiderStep';
import HospitalityRiderStep from './steps/HospitalityRiderStep';
import PerformanceAreaStep from './steps/PerformanceAreaStep';
import MultimediaStep from './steps/MultimediaStep';
import { AvailabilityStep } from '@/components/bands/steps/AvailabilityStep';
import { UpsertBandRequest } from '@/service/backend/band/service/band.service';
import { BandSize } from '@/service/backend/band/domain/bandSize';

interface FormDataWithFiles extends Partial<UpsertBandRequest> {
  imageFile?: File;
}

interface BandProfileFormProps {
  onSubmit: (data: UpsertBandRequest) => Promise<void>;
}

const FORM_STORAGE_KEY = 'bandProfileFormData';
const CURRENT_STEP_KEY = 'bandProfileFormStep';
const TOTAL_STEPS = 6;

export default function BandProfileForm({ onSubmit }: BandProfileFormProps) {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataWithFiles>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        const { imageFile, ...rest } = parsedData;
        return rest;
      }
    }
    return {
      name: '',
      musicalStyleIds: [],
      price: 0,
      location: '',
      bandSize: BandSize.BAND,
      eventTypeIds: [],
      bio: '',
      imageUrl: '',
      visible: true,
      weeklyAvailability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      hospitalityRider: {
        accommodation: '',
        catering: '',
        beverages: '',
        specialRequirements: '',
      },
      technicalRider: {
        soundSystem: '',
        microphones: '',
        backline: '',
        lighting: '',
        otherRequirements: '',
      },
      performanceArea: {
        regions: [],
        travelPreferences: '',
        restrictions: '',
      },
      media: [],
      socialLinks: [],
    };
  });
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});

  const clearFormState = () => {
    setCurrentStep(1);
    setFormData({});
    setStepErrors({});
    setError(null);
    clearFormStorage();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { imageFile, ...dataToSave } = formData;
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
    }
  }, [currentStep]);

  const clearFormStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(CURRENT_STEP_KEY);
    }
  };

  const validateStep = (
    step: number,
    formData: Partial<UpsertBandRequest>,
  ): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.name?.trim() &&
          formData.location?.trim() &&
          (formData.musicalStyleIds?.length ?? 0) > 0 &&
          formData.price !== undefined &&
          formData.bandSize &&
          Object.values(BandSize).includes(formData.bandSize as BandSize)
        );
      case 2:
        return !!(
          formData.technicalRider?.soundSystem?.trim() &&
          formData.technicalRider?.microphones?.trim() &&
          formData.technicalRider?.backline?.trim() &&
          formData.technicalRider?.lighting?.trim()
        );
      case 3:
        return !!(
          formData.hospitalityRider?.accommodation?.trim() &&
          formData.hospitalityRider?.catering?.trim() &&
          formData.hospitalityRider?.beverages?.trim()
        );
      case 4:
        return (
          (formData.performanceArea?.regions?.length ?? 0) > 0 &&
          !!formData.performanceArea?.travelPreferences?.trim()
        );
      case 5:
        return Object.values(formData.weeklyAvailability || {}).some(
          (value) => value,
        );
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isCurrentStepValid = validateStep(currentStep, formData);
    setStepErrors((prev) => ({ ...prev, [currentStep]: !isCurrentStepValid }));

    if (!isCurrentStepValid) {
      return;
    }

    if (currentStep === TOTAL_STEPS) {
      setIsSubmitting(true);
      setError(null);

      try {
        let uploadedImageUrl = formData.imageUrl;
        const uploadedMediaUrls: { url: string; type: string }[] = [];

        if (formData.imageFile instanceof File) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', formData.imageFile);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload profile image');
          }

          const data = await response.json();
          uploadedImageUrl = data.url;
        }

        if (
          formData.media?.some(
            (media) => 'file' in media && media.file instanceof File,
          )
        ) {
          for (const media of formData.media) {
            if ('file' in media && media.file instanceof File) {
              const uploadFormData = new FormData();
              uploadFormData.append('file', media.file);

              const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload media file');
              }

              const data = await response.json();
              uploadedMediaUrls.push({
                url: data.url,
                type: media.type,
              });
            } else {
              uploadedMediaUrls.push({
                url: media.url,
                type: media.type,
              });
            }
          }
        }

        const data: UpsertBandRequest = {
          name: formData.name || '',
          musicalStyleIds: formData.musicalStyleIds || [],
          price: formData.price || 0,
          location: formData.location || '',
          bandSize: (formData.bandSize as BandSize) || BandSize.BAND,
          eventTypeIds: formData.eventTypeIds || [],
          bio: formData.bio || '',
          imageUrl: uploadedImageUrl === '' ? '' : uploadedImageUrl || '',
          visible: formData.visible ?? true,
          weeklyAvailability: formData.weeklyAvailability || {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          },
          hospitalityRider: formData.hospitalityRider || {
            accommodation: '',
            catering: '',
            beverages: '',
            specialRequirements: '',
          },
          technicalRider: formData.technicalRider || {
            soundSystem: '',
            microphones: '',
            backline: '',
            lighting: '',
            otherRequirements: '',
          },
          performanceArea: formData.performanceArea || {
            regions: [],
            travelPreferences: '',
            restrictions: '',
          },
          media:
            uploadedMediaUrls.length > 0
              ? uploadedMediaUrls
              : formData.media || [],
          socialLinks: formData.socialLinks || [],
        };

        await onSubmit(data);
        clearFormStorage();
      } catch (error) {
        setError(t('errorCreating'));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      clearFormState();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFormDataChange = (data: Partial<UpsertBandRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    setStepErrors((prev) => ({ ...prev, [currentStep]: false }));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            hasError={stepErrors[1]}
          />
        );
      case 2:
        return (
          <TechnicalRiderStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            hasError={stepErrors[2]}
          />
        );
      case 3:
        return (
          <HospitalityRiderStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            hasError={stepErrors[3]}
          />
        );
      case 4:
        return (
          <PerformanceAreaStep
            formData={formData}
            onFormDataChange={handleFormDataChange}
            hasError={stepErrors[4]}
          />
        );
      case 5:
        return (
          <AvailabilityStep
            formData={formData}
            onUpdate={handleFormDataChange}
            onError={(error) =>
              setStepErrors((prev) => ({ ...prev, [currentStep]: !!error }))
            }
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
      onStepClick={handleStepClick}
      onCancel={clearFormState}
      isSubmitting={isSubmitting}
    >
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      {renderStep()}
    </BandCreationLayout>
  );
}
