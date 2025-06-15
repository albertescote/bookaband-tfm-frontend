'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/button';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';
import { WeeklyAvailability } from '@/service/backend/artist/domain/bandCatalogItem';
import { createBooking } from '@/service/backend/booking/service/booking.service';
import { Calendar, ChevronDown, Info, MapPin } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import { es } from 'date-fns/locale/es';
import { enUS as en } from 'date-fns/locale/en-US';
import { ca } from 'date-fns/locale/ca';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { TimePicker } from '@/components/shared/timePicker';
import { BookingSummary } from '@/components/bookings/bookingSummary';

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
  venue?: string;
  eventTypeId?: string;
}

interface Place {
  id: string;
  name: string;
  type: 'country' | 'city';
  postalCode?: string;
  country?: string;
}

interface GooglePrediction {
  place_id: string;
  description: string;
  types: string[];
}

interface GooglePlaceDetails {
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export function BookingForm({
  artist,
  language,
  eventTypes,
}: BookingFormProps) {
  console.log(artist);
  const { t } = useTranslation(language, 'bookings');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<Place[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const cityInputRef = useRef<HTMLDivElement>(null);
  const [isCitySearching, setIsCitySearching] = useState(false);

  const [formData, setFormData] = useState({
    initDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(1, 0, 0, 0)),
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
        const initDate = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endDate = new Date(parsedDate);
        endDate.setHours(1, 0, 0, 0);
        setFormData((prev) => ({
          ...prev,
          initDate,
          endDate,
        }));
      }
    }

    if (location) {
      setFormData((prev) => ({ ...prev, city: location }));
    }
  }, [searchParams]);

  useEffect(() => {
    registerLocale('es', es);
    registerLocale('en', en);
    registerLocale('ca', ca);
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setCitySuggestions([]);
        setIsCitySearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySearch = useCallback(
    async (query: string) => {
      setCitySearchQuery(query);
      setIsCitySearching(true);
      if (!query.trim() || !isGoogleMapsLoaded) {
        setCitySuggestions([]);
        return;
      }

      try {
        const autocompleteService =
          new window.google.maps.places.AutocompleteService();
        const request = {
          input: query,
          types: ['(cities)'],
          componentRestrictions: { country: [] },
          language: language,
        };

        const response = await autocompleteService.getPlacePredictions(request);
        const places = response.predictions.map(
          (prediction: GooglePrediction): Place => {
            const cityName = prediction.description.split(',')[0].trim();
            return {
              id: prediction.place_id,
              name: cityName,
              type: 'city',
            };
          },
        );

        setCitySuggestions(places);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCitySuggestions([]);
      }
    },
    [isGoogleMapsLoaded, language],
  );

  const handleCitySelect = async (place: Place) => {
    try {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );

      placesService.getDetails(
        { placeId: place.id },
        (placeDetails: GooglePlaceDetails | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            placeDetails
          ) {
            const addressComponents = placeDetails.address_components || [];
            let postalCode = '';
            let country = '';
            let city = place.name;

            for (const component of addressComponents) {
              if (component.types.includes('postal_code')) {
                postalCode = component.long_name;
              }
              if (component.types.includes('country')) {
                country = component.long_name;
              }
            }

            setFormData((prev) => ({
              ...prev,
              city: city,
              country: country,
              postalCode: postalCode,
            }));
          }
        },
      );
    } catch (error) {
      console.error('Error fetching place details:', error);
    }

    setCitySearchQuery('');
    setCitySuggestions([]);
    setIsCitySearching(false);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.initDate) {
      errors.date = t('validation.required');
      isValid = false;
    }
    if (!formData.endDate) {
      errors.date = t('validation.required');
      isValid = false;
    }

    if (formData.initDate && formData.endDate) {
      if (formData.endDate < formData.initDate) {
        errors.date = t('validation.endDateAfterStart');
        isValid = false;
      }

      const durationInMinutes =
        (formData.endDate.getTime() - formData.initDate.getTime()) /
        (1000 * 60);
      if (durationInMinutes < 5) {
        errors.date = t('validation.minDuration');
        isValid = false;
      }

      const now = new Date();
      if (formData.initDate < now) {
        errors.date = t('validation.futureDate');
        isValid = false;
      }
    }

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

    if (!formData.venue.trim()) {
      errors.venue = t('validation.required');
      isValid = false;
    }

    if (!formData.eventTypeId) {
      errors.eventTypeId = t('validation.required');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
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

  const isDateAvailable = (date: Date): boolean => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (normalizedDate < today) {
      return false;
    }

    const dayOfWeek = normalizedDate.getDay();
    const dayKey = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][dayOfWeek] as keyof WeeklyAvailability;
    return artist.weeklyAvailability[dayKey];
  };

  const getUnavailableDates = (): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookedDates = artist.bookingDates.map((dateStr) => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const dates: Date[] = [];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);

      if (!isDateAvailable(date)) {
        dates.push(date);
      }
    }

    return [...bookedDates, ...dates];
  };

  const unavailableDates = getUnavailableDates();

  const filterDate = (date: Date): boolean => {
    return isDateAvailable(date);
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);

    setFormData((prev) => {
      const newEndDate =
        prev.endDate < newDate ? new Date(newDate) : prev.endDate;
      newEndDate.setHours(newEndDate.getHours() + 1);
      return { ...prev, initDate: newDate, endDate: newEndDate };
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    const newDate = new Date(date);

    newDate.setHours(
      formData.endDate.getHours(),
      formData.endDate.getMinutes(),
      0,
      0,
    );
    setFormData((prev) => ({ ...prev, endDate: newDate }));
  };

  const handleStartTimeChange = (date: Date) => {
    setFormData((prev) => {
      const newInitDate = new Date(date);
      const newEndDate = new Date(prev.endDate);
      return { ...prev, initDate: newInitDate, endDate: newEndDate };
    });
  };

  const handleEndTimeChange = (date: Date) => {
    setFormData((prev) => {
      const newEndDate = new Date(date);
      return { ...prev, endDate: newEndDate };
    });
  };

  return (
    <form
      onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}
      className="min-h-[calc(100vh-4rem)] space-y-6"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                currentStep >= 1
                  ? 'bg-[#15b7b9] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <div
              className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? 'text-[#15b7b9]' : 'text-gray-500'
              }`}
            >
              {t('bookingDetails')}
            </div>
          </div>
          <div className="mx-4 flex-1">
            <div className="h-1 bg-gray-200">
              <div
                className="h-1 bg-[#15b7b9] transition-all duration-300"
                style={{ width: currentStep === 2 ? '100%' : '0%' }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                currentStep >= 2
                  ? 'bg-[#15b7b9] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <div
              className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? 'text-[#15b7b9]' : 'text-gray-500'
              }`}
            >
              {t('bookingSummary')}
            </div>
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
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
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('initDate')} *
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.initDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  excludeDates={unavailableDates}
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('endDate')} *
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.endDate}
                  onChange={handleEndDateChange}
                  minDate={formData.initDate}
                  excludeDates={unavailableDates}
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
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('city')} *
              </label>
              <div className="relative" ref={cityInputRef}>
                <input
                  type="text"
                  value={isCitySearching ? citySearchQuery : formData.city}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => setIsCitySearching(true)}
                  placeholder={t('cityPlaceholder')}
                  className={`w-full rounded-lg border ${
                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                  } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                />
                {citySuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    {citySuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => handleCitySelect(suggestion)}
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.city && (
                <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('country')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  placeholder={t('countryPlaceholder')}
                  className={`w-full rounded-lg border ${
                    formErrors.country ? 'border-red-500' : 'border-gray-300'
                  } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                />
              </div>
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.country}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('postalCode')} *
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
                placeholder={t('postalCodePlaceholder')}
                className={`w-full rounded-lg border ${
                  formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
              />
              {formErrors.postalCode && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.postalCode}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('venue')} *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    placeholder={t('venuePlaceholder')}
                    className={`w-full rounded-lg border ${
                      formErrors.venue ? 'border-red-500' : 'border-gray-300'
                    } p-2.5 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                  />
                  {formErrors.venue && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.venue}
                    </p>
                  )}
                </div>
                <div>
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-2">
                      <div className="flex items-start">
                        <Info className="mt-0.5 h-6 w-6 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-700">
                          {t('venueInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    formErrors.addressLine1
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } p-2.5 pl-10 text-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]`}
                />
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {formErrors.addressLine1 && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.addressLine1}
                </p>
              )}
            </div>

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
              {formErrors.eventTypeId && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.eventTypeId}
                </p>
              )}
            </div>

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
      ) : (
        <BookingSummary
          formData={formData}
          artist={artist}
          eventTypes={eventTypes}
          language={language}
          t={t}
        />
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <div>
          {currentStep === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBackStep}
              className="px-6"
            >
              {t('back')}
            </Button>
          )}
        </div>
        <div className="flex gap-4">
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
            {currentStep === 1
              ? t('next')
              : isLoading
                ? t('creating')
                : t('createBooking')}
          </Button>
        </div>
      </div>
    </form>
  );
}
