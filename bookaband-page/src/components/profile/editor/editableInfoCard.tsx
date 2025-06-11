'use client';

import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';

interface EditableInfoCardProps {
  firstName: string;
  familyName: string;
  email: string;
  bio?: string;
  phoneNumber?: string;
  nationalId?: string;
  onSave: (data: {
    newFirstName: string;
    newFamilyName: string;
    newBio: string;
    newPhoneNumber?: string;
    newNationalId?: string;
  }) => void;
  language: string;
}

export default function EditableInfoCard({
  firstName: initialFirstName,
  familyName: initialFamilyName,
  email,
  bio: initialBio = '',
  phoneNumber: initialPhoneNumber = '',
  nationalId: initialNationalId = '',
  onSave,
  language,
}: EditableInfoCardProps) {
  const { t } = useTranslation(language, 'profile');

  const [firstName, setFirstName] = useState(initialFirstName);
  const [familyName, setFamilyName] = useState(initialFamilyName);
  const [bio, setBio] = useState(initialBio);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber ?? '');
  const [nationalId, setNationalId] = useState(initialNationalId ?? '');

  const hasChanges =
    firstName !== initialFirstName ||
    familyName !== initialFamilyName ||
    bio !== initialBio ||
    phoneNumber !== (initialPhoneNumber ?? '') ||
    nationalId !== (initialNationalId ?? '');

  const handleSave = () => {
    if (hasChanges) {
      onSave({
        newFirstName: firstName,
        newFamilyName: familyName,
        newBio: bio,
        newPhoneNumber: phoneNumber || undefined,
        newNationalId: nationalId || undefined,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <Pencil className="h-5 w-5 text-[#15b7b9]" />
        <h2 className="text-lg font-semibold text-gray-800">
          {t('editPersonalInfo')}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('name')}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('surname')}
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('email')}
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm text-gray-500 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('phoneNumber')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('nationalId')}
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('bio')}
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
          />
        </div>

        <div className="pt-4 text-right">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
              hasChanges
                ? 'bg-[#15b7b9] hover:scale-105 hover:bg-[#13a0a1]'
                : 'bg-gray-300'
            }`}
          >
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
