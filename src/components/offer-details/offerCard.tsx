'use client';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import { checkExistingChat } from '@/service/backend/api';
import { OfferDetails } from '@/service/backend/domain/offerDetails';

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
  const [date, setDate] = useState<Date | null>(today);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const router = useRouter();

  useEffect(() => {
    const dates = offerDetails?.bookingDates.map((date) => new Date(date));
    if (dates) {
      setBookedDates(dates);
    }
  }, []);

  const handleBooking = () => {
    if (date) {
      console.log(`Booking the band for ${date}`);
      alert(`Band booked for ${date.toDateString()}`);
    } else {
      alert('Please select a date before booking.');
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
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700">
              {t('availability')}
            </h3>
            <Calendar
              onChange={(value) => setDate(value as Date)}
              value={date}
              className="my-4"
              minDate={today}
              minDetail="decade"
              tileDisabled={({ date }) => isDateBooked(date)}
              locale={language}
            />
            <button
              onClick={handleBooking}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            >
              {t('book-now')}
            </button>
            <button
              onClick={handleSendMessage}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            >
              {t('send-message')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
