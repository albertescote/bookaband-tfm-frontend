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

interface ClientProfileEditorProps {
  language: string;
  userProfileDetails: UserProfileDetails;
}

export default function ClientProfileEditor({
  language,
  userProfileDetails,
}: ClientProfileEditorProps) {
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleSaveContactInfo = (data: {
    newFirstName: string;
    newFamilyName: string;
    newBio: string;
  }) => {
    updateContactInfo(data.newFirstName, data.newFamilyName, data.newBio)
      .then(() => {
        if (
          data.newFirstName !== userProfileDetails.firstName ||
          data.newFamilyName !== userProfileDetails.familyName
        ) {
          window.location.reload();
        } else {
          router.refresh();
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  if (error) {
    return <Error></Error>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <HeaderSection
        firstName={userProfileDetails.firstName}
        familyName={userProfileDetails.familyName}
        imageUrl={userProfileDetails.imageUrl}
        joinedDate={new Date(userProfileDetails.joinedDate).toLocaleDateString(
          language,
        )}
        bio={userProfileDetails.bio}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EditableInfoCard
            firstName={userProfileDetails.firstName}
            familyName={userProfileDetails.familyName}
            email={userProfileDetails.email}
            bio={userProfileDetails.bio}
            onSave={handleSaveContactInfo}
          />

          <BillingAddressCard
            initialAddress={userProfileDetails.billingAddress}
            setError={setError}
          />

          <PaymentMethodsCard
            methods={userProfileDetails.paymentMethods}
            setError={setError}
          />
        </div>

        <div className="space-y-6">
          <ActivitySummaryCard
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
