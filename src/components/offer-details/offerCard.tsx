'use client';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkExistingChat } from '@/service/backend/api';
import { OfferDetails } from '@/service/backend/domain/offerDetails';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default function OfferCard({
  language,
  offerDetails,
}: {
  language: string;
  offerDetails?: OfferDetails;
}) {
  const { t } = useTranslation(language, 'offer-details');
  const { role } = useAuth();
  const today = new Date();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('12:00');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (offerDetails?.bookingDates && offerDetails.bookingDates.length > 0) {
      const dates = offerDetails?.bookingDates.map((date) => new Date(date));
      setBookedDates(dates);
    }
  }, []);

  const handleBooking = () => {
    if (date) {
      const [hours, minutes] = time.split(':');
      const bookingDate = new Date(date);
      bookingDate.setHours(parseInt(hours, 10));
      bookingDate.setMinutes(parseInt(minutes, 10));
      console.log(`Booking the band for ${bookingDate}`);
      alert(`Band booked for ${bookingDate.toLocaleString()}`);
    } else {
      alert('Please select a date and time before booking.');
    }
  };

  const handleSendMessage = () => {
    if (offerDetails?.bandId) {
      checkExistingChat(offerDetails.bandId).then((existingChatId) => {
        if (existingChatId) {
          router.push(`/chat/${existingChatId}`);
        } else {
          router.push(`/chat/new?band_id=${offerDetails.bandId}`);
        }
      });
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate(),
    );
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${String(hour).padStart(2, '0')}:00`;
      times.push(timeString);
    }
    return times;
  };

  const handleDateSelection = (selectedDate: Date | null) => {
    setDate(selectedDate);
    setShowCalendar(false);
  };

  const handleBackToCalendar = () => {
    setShowCalendar(true);
    setDate(null);
  };

  return (
    <div className="mx-auto min-w-[500px] max-w-md space-y-6 overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
      <div className="flex flex-col items-center">
        {offerDetails?.imageUrl ? (
          <img
            src={offerDetails.imageUrl}
            alt={offerDetails.bandName}
            className="h-28 w-28 rounded-full object-cover shadow-md"
          />
        ) : (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: getRandomColor(
                offerDetails?.bandName ?? 'dummy',
              ),
            }}
          >
            {offerDetails?.bandName ? offerDetails.bandName.charAt(0) : '?'}
          </div>
        )}
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {offerDetails?.bandName}
        </h2>
        <p className="mt-2 text-lg text-gray-500">
          {t('price')}: {offerDetails?.price} €
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {t('genre')}:{' '}
          <span className="text-gray-800">{offerDetails?.genre}</span>
        </p>
        {offerDetails?.description && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {offerDetails.description}
          </p>
        )}
        {role.role === Role.Client && (
          <div className="mt-6 w-full">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              {t('availability')}
            </h3>
            <AnimatePresence mode="wait">
              {showCalendar ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  <DatePicker
                    selected={date}
                    onChange={(date) => handleDateSelection(date)}
                    minDate={today}
                    inline
                    excludeDates={bookedDates}
                    className="rounded-lg border border-gray-200 p-2 shadow-sm"
                    dayClassName={(date) =>
                      isDateBooked(date) ? 'text-gray-400 line-through' : ''
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="time-selector"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <FiCalendar className="mr-2" /> {t('selected-date')}:{' '}
                        {date?.toLocaleDateString(language)}
                      </h4>
                      <button
                        onClick={handleBackToCalendar}
                        className="text-sm text-[#3b82f6] hover:underline"
                      >
                        {t('change-date')}
                      </button>
                    </div>
                    <label
                      htmlFor="time"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiClock className="mr-2" /> {t('select-time')}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {generateTimeOptions().map((timeOption) => (
                        <button
                          key={timeOption}
                          onClick={() => setTime(timeOption)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            time === timeOption
                              ? 'bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {timeOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleBooking}
              disabled={!date}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#1d4ed8] hover:to-[#0e7490] disabled:opacity-50"
            >
              {t('book-now')}
            </button>
            <button
              onClick={handleSendMessage}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#1d4ed8] hover:to-[#0e7490]"
            >
              {t('send-message')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
