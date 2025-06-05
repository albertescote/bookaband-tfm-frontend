'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/button';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';
import { createBooking } from '@/service/backend/booking/service/booking.service';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import { es } from 'date-fns/locale/es';
import { enUS as en } from 'date-fns/locale/en-US';
import { ca } from 'date-fns/locale/ca';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { TimePicker } from '@/components/shared/timePicker';

interface BookingFormProps {
  artist: ArtistDetails;
  language: string;
  eventTypes: EventType[];
}

interface FormErrors {
  date?: string;
  name?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  addressLine1?: string;
}

export function BookingForm({
  artist,
  language,
  eventTypes,
}: BookingFormProps) {
  const { t } = useTranslation(language, 'bookings');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const [formData, setFormData] = useState({
    initDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(0, 0, 0, 0)),
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
    const location = searchParams.get('location');

    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        setFormData((prev) => ({
          ...prev,
          initDate: new Date(parsedDate.setHours(0, 0, 0, 0)),
          endDate: new Date(parsedDate.setHours(0, 0, 0, 0)),
        }));
      }
    }

    if (location) {
      setFormData((prev) => ({ ...prev, city: location }));
    }
  }, [searchParams]);

  // Register locales
  useEffect(() => {
    registerLocale('es', es);
    registerLocale('en', en);
    registerLocale('ca', ca);
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Validate dates and times
    if (!formData.initDate) {
      errors.date = t('validation.required');
      isValid = false;
    }
    if (!formData.endDate) {
      errors.date = t('validation.required');
      isValid = false;
    }

    // Check if end date is after start date
    if (formData.initDate && formData.endDate) {
      if (formData.endDate < formData.initDate) {
        errors.date = t('validation.endDateAfterStart');
        isValid = false;
      }

      // Check if performance duration is at least 5 minutes
      const durationInMinutes =
        (formData.endDate.getTime() - formData.initDate.getTime()) /
        (1000 * 60);
      if (durationInMinutes < 5) {
        errors.date = t('validation.minDuration');
        isValid = false;
      }

      // Check if dates are not in the past
      const now = new Date();
      if (formData.initDate < now) {
        errors.date = t('validation.futureDate');
        isValid = false;
      }
    }

    // Validate other fields
    if (!formData.name.trim()) {
      errors.name = t('validation.required');
      isValid = false;
    }

    if (!formData.country.trim()) {
      errors.country = t('validation.required');
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = t('validation.required');
      isValid = false;
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = t('validation.required');
      isValid = false;
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = t('validation.required');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const booking = await createBooking({
        bandId: artist.id,
        initDate: formData.initDate.toISOString(),
        endDate: formData.endDate.toISOString(),
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
      setError(
        err instanceof Error ? err.message : t('errorScreen.description'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    setFormData((prev) => {
      // If end date is before new start date, set it to start date
      const newEndDate = prev.endDate < date ? date : prev.endDate;
      return { ...prev, initDate: date, endDate: newEndDate };
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    setFormData((prev) => ({ ...prev, endDate: date }));
  };

  const handleStartTimeChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, initDate: date }));
  };

  const handleEndTimeChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, endDate: date }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('bookingDetails')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('bookingDetailsDesc')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('initDate')} *
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.initDate}
                onChange={handleStartDateChange}
                minDate={new Date()}
                className={`w-full rounded-lg border ${
                  formErrors.date ? 'border-red-500' : 'border-gray-300'
                } cursor-pointer p-2.5 pl-10 pr-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]`}
                dateFormat="dd/MM/yyyy"
                calendarClassName="custom-calendar"
                popperClassName="custom-popper"
                popperPlacement="bottom-start"
                locale={language === 'es' ? es : language === 'ca' ? ca : en}
                showPopperArrow={false}
                wrapperClassName="w-full"
                onCalendarOpen={() => setIsStartDateOpen(true)}
                onCalendarClose={() => setIsStartDateOpen(false)}
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <ChevronDown
                className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
                  isStartDateOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            {formErrors.date && (
              <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('initTime')} *
            </label>
            <TimePicker
              value={formData.initDate}
              onChange={handleStartTimeChange}
              t={t}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('endDate')} *
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.endDate}
                onChange={handleEndDateChange}
                minDate={formData.initDate}
                className={`w-full rounded-lg border ${
                  formErrors.date ? 'border-red-500' : 'border-gray-300'
                } cursor-pointer p-2.5 pl-10 pr-10 text-sm focus:border-[#15b7b9] focus:ring-[#15b7b9]`}
                dateFormat="dd/MM/yyyy"
                calendarClassName="custom-calendar"
                popperClassName="custom-popper"
                popperPlacement="bottom-start"
                locale={language === 'es' ? es : language === 'ca' ? ca : en}
                showPopperArrow={false}
                wrapperClassName="w-full"
                onCalendarOpen={() => setIsEndDateOpen(true)}
                onCalendarClose={() => setIsEndDateOpen(false)}
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <ChevronDown
                className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
                  isEndDateOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('endTime')} *
            </label>
            <TimePicker
              value={formData.endDate}
              onChange={handleEndTimeChange}
              t={t}
              disabled={!formData.initDate}
            />
          </div>

          {/* Event Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('eventName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t('eventNamePlaceholder')}
              className={`w-full rounded-lg border ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('country')} *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder={t('countryPlaceholder')}
              className={`w-full rounded-lg border ${
                formErrors.country ? 'border-red-500' : 'border-gray-300'
              } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              required
            />
            {formErrors.country && (
              <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('city')} *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder={t('cityPlaceholder')}
              className={`w-full rounded-lg border ${
                formErrors.city ? 'border-red-500' : 'border-gray-300'
              } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              required
            />
            {formErrors.city && (
              <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
            )}
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
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('postalCode')} *
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              placeholder={t('postalCodePlaceholder')}
              className={`w-full rounded-lg border ${
                formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
              } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              required
            />
            {formErrors.postalCode && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.postalCode}
              </p>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('addressLine1')} *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                placeholder={t('addressLine1Placeholder')}
                className={`w-full rounded-lg border ${
                  formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                } p-2.5 pl-10 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                required
              />
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {formErrors.addressLine1 && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.addressLine1}
              </p>
            )}
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
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
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
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            >
              <option value="">{t('selectEventType')}</option>
              {artist.eventTypeIds.map((typeId) => {
                const eventType = eventTypes.find((et) => et.id === typeId);
                if (!eventType) return null;
                return (
                  <option
                    key={typeId}
                    value={typeId}
                    className="flex items-center gap-2"
                  >
                    {eventType.icon} {eventType.label[language]}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Public Event Toggle */}
          <div className="md:col-span-2">
            <label className="group flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-[#15b7b9] hover:bg-gray-50">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-[#15b7b9] checked:bg-[#15b7b9] hover:border-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                />
                <svg
                  className="pointer-events-none absolute h-3 w-3 scale-0 fill-white transition-transform peer-checked:scale-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#15b7b9]">
                {t('publicEvent')}
              </span>
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
          onClick={() => router.push(`/${language}/find-artists`)}
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
