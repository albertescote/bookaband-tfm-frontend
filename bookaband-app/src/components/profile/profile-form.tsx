'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import { User } from '@/service/backend/user/domain/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { getAvatar } from '@/components/shared/avatar';
import { Camera } from 'lucide-react';
import { updateProfile } from '@/service/backend/user/service/user.service';

interface FileUploadResponse {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

interface ProfileFormProps {
  language: string;
}

export default function ProfileForm({ language }: ProfileFormProps) {
  const { t } = useTranslation(language, 'profile');
  const { user } = useAuth();

  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    familyName: '',
    email: '',
    imageUrl: '',
    bio: '',
    phoneNumber: '',
    nationalId: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');
  const [countryCode, setCountryCode] = useState('+34');

  useEffect(() => {
    if (user) {
      const phoneNumber = user.phoneNumber || '';
      const [code, ...rest] = phoneNumber.split(' ');
      setCountryCode(code || '+34');
      setFormData({
        firstName: user.firstName,
        familyName: user.familyName,
        email: user.email,
        imageUrl: user.imageUrl,
        bio: user.bio || '',
        phoneNumber: rest.join(' ') || '',
        nationalId: user.nationalId || '',
      });
    }
  }, [user]);

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
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
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
    setFormData((prev) => ({ ...prev, nationalId: value }));
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
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      setPhoneError(t('validation.phoneNumberError'));
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError || nationalIdError) return;
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      if (tempFile) {
        const formData = new FormData();
        formData.append('file', tempFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload file');
        }

        const data: FileUploadResponse = await response.json();
        imageUrl = data.url;
      }

      await updateProfile({
        firstName: formData.firstName || '',
        familyName: formData.familyName || '',
        bio: formData.bio,
        imageUrl,
        phoneNumber: formData.phoneNumber
          ? `${countryCode} ${formData.phoneNumber}`
          : '',
        nationalId: formData.nationalId,
      });

      setFormData((prev) => ({ ...prev, imageUrl }));
      setTempImageUrl(null);
      setTempFile(null);

      toast.success(t('profile-updated'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('error-updating'));
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const blobUrl = URL.createObjectURL(file);
      setTempImageUrl(blobUrl);
      setTempFile(file);
    } catch (error) {
      toast.error(t('error-uploading-image'));
    }
  };

  const handleCancel = () => {
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
    }
    setTempImageUrl(null);
    setTempFile(null);
    setIsEditing(false);
  };

  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
      }
    };
  }, [tempImageUrl]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-800">
            {t('profile-title')}
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
          >
            {isEditing ? t('cancel') : t('edit')}
          </button>
        </div>

        <div className="mb-8 flex items-center space-x-6">
          <div className="relative">
            {getAvatar(
              20,
              tempImageUrl || formData.imageUrl,
              formData.firstName,
            )}
            {isEditing && (
              <>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15b7b9] text-white transition-colors hover:bg-[#15b7b9]/90"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {formData.firstName} {formData.familyName}
            </h2>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName">{t('first-name')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="familyName">{t('family-name')}</Label>
              <Input
                id="familyName"
                value={formData.familyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    familyName: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled={true}
              className="bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="phoneNumber">{t('phone-number')}</Label>
              <div className="flex gap-2">
                <div className="w-24">
                  <select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    disabled={!isEditing}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-50"
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
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    disabled={!isEditing}
                    className={phoneError ? 'border-red-500' : ''}
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="nationalId">{t('national-id')}</Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={handleNationalIdChange}
                disabled={!isEditing}
                className={nationalIdError ? 'border-red-500' : ''}
              />
              {nationalIdError && (
                <p className="mt-1 text-xs text-red-500">{nationalIdError}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">{t('bio')}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              disabled={!isEditing}
              placeholder={t('bio-placeholder')}
              className="min-h-[100px] resize-none"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90 disabled:opacity-50"
              >
                {isLoading ? t('saving') : t('save')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
