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
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (!initialPhoneNumber) return '';
    const [code, ...rest] = initialPhoneNumber.split(' ');
    return rest.join(' ');
  });
  const [nationalId, setNationalId] = useState(initialNationalId ?? '');
  const [countryCode, setCountryCode] = useState(() => {
    if (!initialPhoneNumber) return '+34';
    const [code] = initialPhoneNumber.split(' ');
    return code || '+34';
  });
  const [phoneError, setPhoneError] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');

  const validatePhoneNumber = (number: string) => {
    if (!number) return true;

    if (/[a-zA-Z]/.test(number)) {
      return false;
    }

    const digitsOnly = number.replace(/\D/g, '');
    const lengthByCountry: { [key: string]: number } = {
      '+34': 9,
      '+44': 10,
      '+33': 9,
      '+49': 10,
      '+39': 10,
      '+351': 9,
      '+1': 10,
    };
    const expectedLength = lengthByCountry[countryCode] || 10;
    return digitsOnly.length === expectedLength;
  };

  const validateNationalId = (id: string) => {
    if (!id) return true;
    if (countryCode === '+34') {
      const dniRegex = /^[0-9]{8}[A-Z]$/;
      const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
      return dniRegex.test(id) || nieRegex.test(id);
    }
    return id.length > 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value) {
      if (/[a-zA-Z]/.test(value)) {
        setPhoneError(t('validation.phoneNumberLettersError'));
      } else if (!validatePhoneNumber(value)) {
        setPhoneError(t('validation.phoneNumberError'));
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNationalId(value);
    if (value && !validateNationalId(value)) {
      setNationalIdError(
        countryCode === '+34'
          ? t('validation.nationalIdErrorSpain')
          : t('validation.nationalIdError'),
      );
    } else {
      setNationalIdError('');
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountryCode(value);
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError(t('validation.phoneNumberError'));
    } else {
      setPhoneError('');
    }
  };

  const hasChanges =
    firstName !== initialFirstName ||
    familyName !== initialFamilyName ||
    bio !== initialBio ||
    phoneNumber !==
      (initialPhoneNumber
        ? initialPhoneNumber.split(' ').slice(1).join(' ')
        : '') ||
    nationalId !== (initialNationalId ?? '') ||
    countryCode !==
      (initialPhoneNumber ? initialPhoneNumber.split(' ')[0] : '+34');

  const isValid = !phoneError && !nationalIdError;

  const handleSave = () => {
    if (hasChanges && isValid) {
      onSave({
        newFirstName: firstName,
        newFamilyName: familyName,
        newBio: bio,
        newPhoneNumber: phoneNumber ? `${countryCode} ${phoneNumber}` : '',
        newNationalId: nationalId,
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
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
          <div className="flex-1">
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
          <div className="flex-1">
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

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              {t('phoneNumber')}
            </label>
            <div className="flex gap-2">
              <div className="w-24">
                <select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
                >
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`mt-1 w-full rounded-md border ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  } p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              {t('nationalId')}
            </label>
            <div>
              <input
                type="text"
                value={nationalId}
                onChange={handleNationalIdChange}
                className={`mt-1 w-full rounded-md border ${
                  nationalIdError ? 'border-red-500' : 'border-gray-300'
                } p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              />
              {nationalIdError && (
                <p className="mt-1 text-xs text-red-500">{nationalIdError}</p>
              )}
            </div>
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
            disabled={!hasChanges || !isValid}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
              hasChanges && isValid
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
