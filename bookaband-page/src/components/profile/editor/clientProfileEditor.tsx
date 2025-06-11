'use client';

import React, { useState } from 'react';
import HeaderSection from '@/components/profile/editor/headerSection';
import EditableInfoCard from '@/components/profile/editor/editableInfoCard';
import PaymentMethodsCard from '@/components/profile/editor/paymentMethodsCard';
import ActivitySummaryCard from '@/components/profile/editor/activitySummaryCard';
import BillingAddressCard from '@/components/profile/editor/billingAddressCard';
import { UserProfileDetails } from '@/service/backend/user/domain/userProfileDetails';
import { updateContactInfo } from '@/service/backend/user/service/user.service';
import { useRouter } from 'next/navigation';
import Error from '@/components/shared/error';
import { useTranslation } from '@/app/i18n/client';

interface ClientProfileEditorProps {
  language: string;
  userProfileDetails: UserProfileDetails;
}

export default function ClientProfileEditor({
  language,
  userProfileDetails,
}: ClientProfileEditorProps) {
  const { t } = useTranslation(language, 'profile');
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleSaveContactInfo = (data: {
    newFirstName: string;
    newFamilyName: string;
    newBio: string;
    newPhoneNumber?: string;
    newNationalId?: string;
  }) => {
    updateContactInfo(
      data.newFirstName,
      data.newFamilyName,
      data.newBio,
      userProfileDetails.imageUrl,
      data.newPhoneNumber,
      data.newNationalId,
    )
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        setError(true);
      });
  };

  const handleImageUpdate = (newImageUrl: string) => {
    updateContactInfo(
      userProfileDetails.firstName,
      userProfileDetails.familyName,
      userProfileDetails.bio || '',
      newImageUrl,
      userProfileDetails.phoneNumber || '',
      userProfileDetails.nationalId || '',
    )
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        setError(true);
      });
  };

  if (error) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <HeaderSection
        language={language}
        firstName={userProfileDetails.firstName}
        familyName={userProfileDetails.familyName}
        imageUrl={userProfileDetails.imageUrl}
        joinedDate={new Date(userProfileDetails.joinedDate).toLocaleDateString(
          language,
        )}
        bio={userProfileDetails.bio}
        onImageUpdate={handleImageUpdate}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EditableInfoCard
            firstName={userProfileDetails.firstName}
            familyName={userProfileDetails.familyName}
            email={userProfileDetails.email}
            bio={userProfileDetails.bio}
            phoneNumber={userProfileDetails.phoneNumber}
            nationalId={userProfileDetails.nationalId}
            onSave={handleSaveContactInfo}
            language={language}
          />

          <BillingAddressCard
            language={language}
            initialAddress={userProfileDetails.billingAddress}
            setError={setError}
          />

          <PaymentMethodsCard
            language={language}
            methods={userProfileDetails.paymentMethods}
            setError={setError}
          />
        </div>

        <div className="space-y-6">
          <ActivitySummaryCard
            language={language}
            musiciansContacted={
              userProfileDetails.activitySummary.musiciansContacted
            }
            eventsOrganized={userProfileDetails.activitySummary.eventsOrganized}
          />
        </div>
      </div>
    </div>
  );
}
