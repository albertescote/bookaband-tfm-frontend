'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Building2, PlusCircle, Save, X } from 'lucide-react';
import { BillingAddress } from '@/service/backend/user/domain/billingAddress';
import {
  createBillingAddress,
  deleteBillingAddress,
  updateBillingAddress,
} from '@/service/backend/user/service/billingAddress.service';
import { toast } from 'react-hot-toast';

interface BillingAddressCardProps {
  initialAddress?: BillingAddress;
  setError: Dispatch<SetStateAction<boolean>>;
}

export default function BillingAddressCard({
  initialAddress,
  setError,
}: BillingAddressCardProps) {
  const [editing, setEditing] = useState(!!initialAddress);
  const [address, setAddress] = useState<BillingAddress>(
    initialAddress ?? {
      id: '',
      country: '',
      city: '',
      postalCode: '',
      addressLine1: '',
      addressLine2: '',
    },
  );

  const handleChange = (key: keyof BillingAddress, value: string) => {
    setAddress({ ...address, [key]: value });
  };

  const handleSave = () => {
    const isValid =
      address.country &&
      address.city &&
      address.postalCode &&
      address.addressLine1;

    if (!isValid) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (initialAddress) {
      updateBillingAddress(address)
        .then(() => {
          toast.success('Billing Address info updated!');
        })
        .catch(() => setError(true));
    } else {
      const { id, ...body } = address;
      createBillingAddress(body)
        .then(() => {
          toast.success('Billing Address info created!');
        })
        .catch(() => setError(true));
    }
  };

  const handleDelete = () => {
    deleteBillingAddress(address.id)
      .then(() => {
        toast.success('Billing Address info deleted!');
        setAddress({
          id: '',
          country: '',
          city: '',
          postalCode: '',
          addressLine1: '',
          addressLine2: '',
        });
        setEditing(false);
      })
      .catch(() => setError(true));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#15b7b9]" />
          <h2 className="text-lg font-semibold text-gray-800">
            Billing Address
          </h2>
        </div>
      </div>

      {!editing ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-gray-500">No billing address on file.</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-[#15b7b9] hover:underline"
          >
            <PlusCircle className="h-4 w-4" />
            Add Billing Address
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              placeholder="Country"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            <input
              required
              placeholder="City"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <input
              required
              placeholder="Postal Code"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={address.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
            <input
              required
              placeholder="Address Line 1"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={address.addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
            />
            <input
              placeholder="Address Line 2"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={address.addressLine2 || ''}
              onChange={(e) => handleChange('addressLine2', e.target.value)}
            />
          </div>

          <div className="mt-4 space-x-4 text-right">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-[#15b7b9] px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#13a0a1]"
            >
              <Save className="h-4 w-4" />
              Save Address
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:scale-105 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
