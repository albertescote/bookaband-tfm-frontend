'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import { User } from '@/service/backend/user/domain/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { getAvatar } from '@/components/shared/avatar';
import { Camera } from 'lucide-react';
import { updateProfile, uploadProfileImage } from '@/service/backend/user/service/user.service';

export default function ProfilePage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'profile');
  const { user } = useAuth();

  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    familyName: '',
    email: '',
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        familyName: user.familyName,
        email: user.email,
        imageUrl: user.imageUrl,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        firstName: formData.firstName,
        familyName: formData.familyName,
        email: formData.email,
      });
      toast.success(t('profile-updated'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('error-updating'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { imageUrl } = await uploadProfileImage(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
      toast.success(t('image-updated'));
    } catch (error) {
      toast.error(t('error-uploading-image'));
    }
  };

  return (
    <main className="flex-1 p-6">
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
              {getAvatar(100, 100, formData.imageUrl, formData.firstName)}
              {isEditing && (
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15b7b9] text-white transition-colors hover:bg-[#15b7b9]/90"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
    </main>
  );
} 