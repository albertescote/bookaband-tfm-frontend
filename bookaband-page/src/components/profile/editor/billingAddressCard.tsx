'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Building2, PlusCircle, Save, X } from 'lucide-react';
import { BillingAddress } from '@/service/backend/user/domain/billingAddress';
import {
  createBillingAddress,
  deleteBillingAddress,
  updateBillingAddress,
} from '@/service/backend/user/service/billingAddress.service';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/app/i18n/client';

interface BillingAddressCardProps {
  initialAddress?: BillingAddress;
  setError: Dispatch<SetStateAction<boolean>>;
  language: string;
}

export default function BillingAddressCard({
  initialAddress,
  setError,
  language,
}: BillingAddressCardProps) {
  const { t } = useTranslation(language, 'profile');

  const emptyAddress: BillingAddress = {
    id: '',
    country: '',
    city: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
  };

  const [editing, setEditing] = useState(!!initialAddress);
  const [address, setAddress] = useState<BillingAddress>(
    initialAddress ?? emptyAddress,
  );
  const [currentInitialAddress, setCurrentInitialAddress] = useState<
    BillingAddress | undefined
  >(initialAddress);

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
      setCurrentInitialAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleChange = (key: keyof BillingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const isModified = currentInitialAddress
    ? JSON.stringify(address) !== JSON.stringify(currentInitialAddress)
    : true;

  const isValid =
    address.country &&
    address.city &&
    address.postalCode &&
    address.addressLine1;

  const handleSave = () => {
    if (!isValid) {
      toast.error(t('errorMissingFields'));
      return;
    }

    if (currentInitialAddress && currentInitialAddress.id) {
      updateBillingAddress(address)
        .then(() => {
          toast.success(t('successUpdate'));
          setCurrentInitialAddress(address);
        })
        .catch(() => setError(true));
    } else {
      const { id, ...body } = address;
      createBillingAddress(body)
        .then(() => {
          toast.success(t('successCreate'));
          setCurrentInitialAddress({ ...address, id: 'temp' });
        })
        .catch(() => setError(true));
    }
  };

  const handleDelete = () => {
    deleteBillingAddress(address.id)
      .then(() => {
        toast.success(t('successDelete'));
        setAddress(emptyAddress);
        setCurrentInitialAddress(undefined);
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
            {t('billingAddress')}
          </h2>
        </div>
      </div>

      {!editing ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-gray-500">{t('noBillingAddress')}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-[#15b7b9] hover:underline"
          >
            <PlusCircle className="h-4 w-4" />
            {t('addBillingAddress')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              placeholder={t('country')}
              name="country"
              value={address.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
            <input
              placeholder={t('city')}
              name="city"
              autoComplete="address-level2"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
            <input
              placeholder={t('postalCode')}
              name="postalCode"
              autoComplete="postal-code"
              value={address.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
            <input
              placeholder={t('addressLine1')}
              name="addressLine1"
              autoComplete="address-line1"
              value={address.addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
            <input
              placeholder={t('addressLine2')}
              name="addressLine2"
              autoComplete="address-line2"
              value={address.addressLine2 || ''}
              onChange={(e) => handleChange('addressLine2', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>

          <div className="mt-4 space-x-4 text-right">
            <button
              onClick={handleSave}
              disabled={!isValid || !isModified}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                isValid && isModified
                  ? 'bg-[#15b7b9] text-white hover:scale-105 hover:bg-[#13a0a1]'
                  : 'cursor-not-allowed bg-gray-300 text-white'
              }`}
            >
              <Save className="h-4 w-4" />
              {t('saveAddress')}
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:scale-105 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              {t('delete')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
