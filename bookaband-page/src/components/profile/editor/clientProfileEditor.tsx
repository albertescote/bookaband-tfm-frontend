'use client';

import React from 'react';
import HeaderSection from '@/components/profile/editor/headerSection';
import EditableInfoCard, {
  BillingAddress,
} from '@/components/profile/editor/editableInfoCard';
import PaymentMethodsCard from '@/components/profile/editor/paymentMethodsCard';
import ActivitySummaryCard from '@/components/profile/editor/activitySummaryCard';
import BillingAddressCard from '@/components/profile/editor/billingAddressCard';

// Tipado de datos simulados (puedes sustituirlo por tipos reales del backend)
const mockData = {
  fullName: 'Alice Johnson',
  email: 'alice@example.com',
  imageUrl: '',
  billingAddress: {
    country: 'Spain',
    city: 'Barcelona',
    postalCode: '08029',
    addressLine1: 'Carrer Mallorca, 81',
  },
  joinedDate: 'March 2024',
  bio: 'Event manager with a passion for live music and unforgettable experiences.',
  musiciansContacted: 12,
  eventsOrganized: 5,
  paymentMethods: [
    {
      id: 'pm1',
      type: 'credit_card',
      brand: 'Visa',
      lastFour: '1234',
      isDefault: true,
    },
    { id: 'pm2', type: 'paypal', brand: 'PayPal', lastFour: '—' },
  ],
  contracts: [
    {
      id: 'c1',
      bandName: 'The Swingers',
      date: '2025-05-01',
      status: 'signed',
    },
    {
      id: 'c2',
      bandName: 'Electric Nights',
      date: '2025-05-15',
      status: 'pending',
    },
    {
      id: 'c3',
      bandName: 'Acoustic Soul',
      date: '2025-04-20',
      status: 'cancelled',
    },
  ],
  invoices: [
    { id: 'inv-001', date: '2025-04-22', amount: 850, status: 'paid' },
    { id: 'inv-002', date: '2025-05-02', amount: 1200, status: 'pending' },
  ],
};

export default function ClientProfileEditor() {
  const handleSaveInfo = (data: {
    fullName: string;
    email: string;
    billingAddress: BillingAddress;
    bio: string;
  }) => {
    console.log('Saving user info:', data);
    // Aquí podrías llamar a tu API
  };

  const handleAddPaymentMethod = () => {
    console.log('Trigger add payment method modal or flow');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <HeaderSection
        fullName={mockData.fullName}
        imageUrl={mockData.imageUrl}
        joinedDate={mockData.joinedDate}
        bio={mockData.bio}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EditableInfoCard
            fullName={mockData.fullName}
            email={mockData.email}
            billingAddress={mockData.billingAddress}
            bio={mockData.bio}
            onSave={handleSaveInfo}
          />

          <BillingAddressCard
            initialAddress={{
              country: 'Spain',
              city: 'Barcelona',
              postalCode: '08001',
              addressLine1: 'Carrer de Balmes 123',
              addressLine2: '',
            }}
            onSave={(data) => {
              console.log('Billing address saved:', data);
              // Aquí puedes hacer fetch a backend
            }}
          />

          <PaymentMethodsCard
            methods={mockData.paymentMethods}
            onAdd={handleAddPaymentMethod}
          />
        </div>

        <div className="space-y-6">
          <ActivitySummaryCard
            musiciansContacted={mockData.musiciansContacted}
            eventsOrganized={mockData.eventsOrganized}
          />
        </div>
      </div>
    </div>
  );
}
