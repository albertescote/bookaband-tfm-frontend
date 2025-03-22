'use client';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/user/domain/role';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { AnimatePresence } from 'framer-motion';
import BandInfo from '@/components/offer-details/bandInfo';
import CalendarPicker from '@/components/offer-details/calendarPicker';
import TimePicker from '@/components/offer-details/timePicker';
import BookingActions from '@/components/offer-details/bookingActions';
import { checkExistingChat } from '@/service/backend/chat/service/chat.service';
import { createBooking } from '@/service/backend/booking/service/booking.service';
import { getAvatar } from '@/components/shared/avatar';

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
      const dates = offerDetails.bookingDates.map((date) => new Date(date));
      setBookedDates(dates);
    }
  }, [offerDetails]);

  const handleBooking = () => {
    if (date) {
      const [hours, minutes] = time.split(':');
      const bookingDate = new Date(date);
      bookingDate.setHours(parseInt(hours, 10));
      bookingDate.setMinutes(parseInt(minutes, 10));
      createBooking({ offerId: offerDetails?.id, date: bookingDate }).then(
        (booking) => {
          router.push(`/booking/${booking?.id}`);
        },
      );
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
        {getAvatar(112, 112, offerDetails?.imageUrl, offerDetails?.bandName)}
        <BandInfo
          bandName={offerDetails?.bandName}
          price={offerDetails?.price}
          genre={offerDetails?.genre}
          description={offerDetails?.description}
          t={t}
        />
        {role.role === Role.Client && (
          <div className="mt-6 w-full">
            <h3 className="mb-4 text-lg font-medium text-gray-700">
              {t('availability')}
            </h3>
            <AnimatePresence mode="wait">
              {showCalendar ? (
                <CalendarPicker
                  date={date}
                  today={today}
                  bookedDates={bookedDates}
                  isDateBooked={isDateBooked}
                  handleDateSelection={handleDateSelection}
                  language={language}
                />
              ) : (
                <TimePicker
                  date={date}
                  time={time}
                  setTime={setTime}
                  handleBackToCalendar={handleBackToCalendar}
                  generateTimeOptions={generateTimeOptions}
                  language={language}
                  t={t}
                />
              )}
            </AnimatePresence>
            <BookingActions
              handleBooking={handleBooking}
              handleSendMessage={handleSendMessage}
              isDateSelected={!!date}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}
