'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { toast } from 'react-hot-toast';

export default function CompleteProfile({ language }: { language: string }) {
  const { t } = useTranslation(language, 'complete-profile');
  const router = useRouter();

  const [role, setRole] = useState<'MUSICIAN' | 'CLIENT' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [stageName, setStageName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !firstName || !familyName) {
      toast.error(t('error-missing-fields'));
      return;
    }

    setLoading(true);
    try {
      /*await updateProfile({
        role,
        firstName,
        familyName,
        stageName: role === 'MUSICIAN' ? stageName : undefined,
        location,
        bio,
      });*/
      toast.success(t('profile-updated'));
      router.push(`/${language}/`);
    } catch {
      toast.error(t('error-server'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-xl space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-extrabold text-gray-800">
          {t('form-title')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t('select-role')}</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'MUSICIAN' | 'CLIENT')}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            >
              <option value="">{t('select-role-placeholder')}</option>
              <option value="MUSICIAN">{t('role-musician')}</option>
              <option value="CLIENT">{t('role-client')}</option>
            </select>
          </div>

          <div>
            <Label htmlFor="firstName">{t('first-name')}</Label>
            <Input
              id="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="familyName">{t('family-name')}</Label>
            <Input
              id="familyName"
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>

          {role === 'MUSICIAN' && (
            <div>
              <Label htmlFor="stageName">{t('stage-name')}</Label>
              <Input
                id="stageName"
                placeholder={t('stage-name-placeholder')}
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              placeholder={t('location-placeholder')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">{t('bio')}</Label>
            <textarea
              id="bio"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              placeholder={t('bio-placeholder')}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#15b7b9] to-[#0e9fa1] px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? t('saving') : t('save-button')}
          </button>
        </form>
      </div>
    </main>
  );
}
