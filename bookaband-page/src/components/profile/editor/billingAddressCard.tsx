'use client';

import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';

interface BillingAddress {
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}

interface BillingAddressCardProps {
  initialAddress: BillingAddress;
  onSave: (address: BillingAddress) => void;
}

export default function BillingAddressCard({
  initialAddress,
  onSave,
}: BillingAddressCardProps) {
  const [address, setAddress] = useState<BillingAddress>(initialAddress);

  const handleChange = (key: keyof BillingAddress, value: string) => {
    setAddress({ ...address, [key]: value });
  };

  const handleSave = () => {
    onSave(address);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-[#15b7b9]" />
        <h2 className="text-lg font-semibold text-gray-800">Billing Address</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          placeholder="Country"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          value={initialAddress.country}
          onChange={(e) => handleChange('country', e.target.value)}
        />
        <input
          placeholder="City"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          value={initialAddress.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
        <input
          placeholder="Postal Code"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          value={initialAddress.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
        />
        <input
          placeholder="Address Line 1"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          value={initialAddress.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
        />
        <input
          placeholder="Address Line 2"
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          value={initialAddress.addressLine2 || ''}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
        />
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-[#15b7b9] px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#13a0a1]"
        >
          <Save className="h-4 w-4" />
          Save Address
        </button>
      </div>
    </div>
  );
}
