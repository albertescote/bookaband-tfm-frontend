'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/button';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';
import { createBooking } from '@/service/backend/booking/service/booking.service';
import { useAuth } from '@/providers/authProvider';
import { Calendar, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingFormProps {
  artist: ArtistDetails;
  language: string;
}

export function BookingForm({ artist, language }: BookingFormProps) {
  const { t } = useTranslation(language, 'bookings');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date(),
    name: '',
    country: '',
    city: '',
    venue: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
    eventTypeId: '',
    isPublic: false,
  });

  useEffect(() => {
    const date = searchParams.get('date');
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        setFormData((prev) => ({ ...prev, date: parsedDate }));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${language}/login`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const booking = await createBooking({
        bandId: artist.id,
        date: formData.date.toISOString(),
        name: formData.name,
        country: formData.country,
        city: formData.city,
        venue: formData.venue,
        postalCode: formData.postalCode,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        eventTypeId: formData.eventTypeId || undefined,
        isPublic: formData.isPublic,
      });

      if (!booking) {
        throw new Error(t('errorScreen.description'));
      }

      router.push(`/${language}/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorScreen.description'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('bookingDetails')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{t('bookingDetailsDesc')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('date')}
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.date}
                onChange={(date: Date | null) =>
                  date && setFormData({ ...formData, date })
                }
                minDate={new Date()}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                dateFormat="P"
              />
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('eventName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t('eventNamePlaceholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('country')}
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder={t('countryPlaceholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('city')}
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder={t('cityPlaceholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              required
            />
          </div>

          {/* Venue */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('venue')}
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              placeholder={t('venuePlaceholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              required
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('postalCode')}
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              placeholder={t('postalCodePlaceholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
              required
            />
          </div>

          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('addressLine1')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                placeholder={t('addressLine1Placeholder')}
                className="w-full rounded-lg border border-gray-300 p-2.5 pl-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
                required
              />
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Address Line 2 */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('addressLine2')}
            </label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) =>
                setFormData({ ...formData, addressLine2: e.target.value })
              }
              placeholder={t('addressLine2Placeholder')}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            />
          </div>

          {/* Event Type */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('eventType')}
            </label>
            <select
              value={formData.eventTypeId}
              onChange={(e) =>
                setFormData({ ...formData, eventTypeId: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]"
            >
              <option value="">{t('selectEventType')}</option>
              {artist.eventTypeIds.map((typeId) => (
                <option key={typeId} value={typeId}>
                  {typeId}
                </option>
              ))}
            </select>
          </div>

          {/* Public Event Toggle */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-[#15b7b9] focus:ring-[#15b7b9]"
              />
              <span className="text-sm text-gray-700">{t('publicEvent')}</span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="px-6"
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          className="bg-[#15b7b9] px-6 text-white hover:bg-[#15b7b9]/90"
          disabled={isLoading}
        >
          {isLoading ? t('creating') : t('createBooking')}
        </Button>
      </div>
    </form>
  );
} 