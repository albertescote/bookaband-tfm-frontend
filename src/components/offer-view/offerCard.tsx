'use client';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/AuthProvider';
import { OfferView } from '@/service/backend/domain/offerView';
import { Role } from '@/service/backend/domain/role';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default function OfferCard({
  language,
  offerView,
}: {
  language: string;
  offerView?: OfferView;
}) {
  const { t } = useTranslation(language, 'offer-view');
  const { role } = useAuth();
  const today = new Date();
  const [date, setDate] = useState<Date | null>(today);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            new Date(2024, 9, 25),
            new Date(2024, 9, 26),
            new Date(2024, 10, 2),
          ]);
        }, 1000);
      });
      setBookedDates(response as Date[]);
    };

    fetchBookedDates();
  }, []);

  const handleBooking = () => {
    if (date) {
      console.log(`Booking the band for ${date}`);
      alert(`Band booked for ${date.toDateString()}`);
    } else {
      alert('Please select a date before booking.');
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
        {offerView?.imageUrl ? (
          <img
            src={offerView.imageUrl}
            alt={offerView.bandName}
            className="h-28 w-28 rounded-full object-cover shadow-md"
          />
        ) : (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: getRandomColor(offerView?.bandName ?? 'dummy'),
            }}
          >
            {offerView?.bandName ? offerView.bandName.charAt(0) : '?'}
          </div>
        )}
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {offerView?.bandName}
        </h2>
        <p className="mt-2 text-lg text-gray-500">
          {t('price')}: {offerView?.price} €
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {t('genre')}:{' '}
          <span className="text-gray-800">{offerView?.genre}</span>
        </p>
        {offerView?.description && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {offerView.description}
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
            <button className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]">
              {t('send-message')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
