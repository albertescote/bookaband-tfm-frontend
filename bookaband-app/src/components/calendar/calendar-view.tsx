'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/authProvider';
import { getBandProfileById } from '@/service/backend/band/service/band.service';
import { useTranslation } from '@/app/i18n/client';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Event,
  WeeklyAvailability,
} from '@/service/backend/band/domain/bandProfile';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import { fetchEventTypes } from '@/service/backend/eventTypes/service/eventType.service';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import Link from 'next/link';

interface CalendarViewProps {
  language: string;
}

export default function CalendarView({ language }: CalendarViewProps) {
  const { t } = useTranslation(language, 'calendar');
  const { selectedBand } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] =
    useState<WeeklyAvailability>({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventTypesResponse] = await Promise.all([fetchEventTypes()]);

        if (!Array.isArray(eventTypesResponse)) {
          throw new Error('Failed to fetch event types');
        }

        setEventTypes(eventTypesResponse);
      } catch (err) {
        const errorMessage = t('errors.fetchEventTypes');
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    const fetchBandEvents = async () => {
      if (!selectedBand) {
        setLoading(false);
        return;
      }

      try {
        const bandProfile = await getBandProfileById(selectedBand.id);
        if (bandProfile) {
          setEvents(
            bandProfile.events
              ? bandProfile.events.filter(
                  (event) =>
                    event.status !== BookingStatus.DECLINED &&
                    event.status !== BookingStatus.CANCELED,
                )
              : [],
          );
          setWeeklyAvailability(
            bandProfile.weeklyAvailability || {
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false,
              sunday: false,
            },
          );
        }
      } catch (err) {
        const errorMessage = t('errors.fetchEvents');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBandEvents();
  }, [selectedBand, t]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getEventType = (eventTypeId: string) => {
    return eventTypes.find((type) => type.id === eventTypeId);
  };

  const getEventTypeLabel = (eventTypeId: string) => {
    const eventType = getEventType(eventTypeId);
    return eventType?.label[language] || '';
  };

  const isDayAvailable = (day: number) => {
    const dayOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    return weeklyAvailability[dayOfWeek as keyof WeeklyAvailability];
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, showAllEvents ? undefined : 3);

  const formatMonthYear = (date: Date) => {
    const monthYear = date.toLocaleDateString(language, {
      month: 'long',
      year: 'numeric',
    });
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  };

  const isCurrentDay = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventStatusColor = (status: BookingStatus | undefined) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-600';
      case BookingStatus.ACCEPTED:
        return 'bg-[#15b7b9]/10 text-[#15b7b9]';
      case BookingStatus.SIGNED:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50';
      case BookingStatus.PAID:
        return 'bg-gradient-to-r from-purple-50 to-violet-50';
      default:
        return 'bg-[#15b7b9]/10 text-[#15b7b9]';
    }
  };

  if (loading) {
    return <div className="p-4">{t('loading')}</div>;
  }

  if (!selectedBand) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg text-gray-500">{t('no-band-selected')}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {formatMonthYear(currentDate)}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="transition-colors hover:bg-[#15b7b9] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="transition-colors hover:bg-[#15b7b9] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-sm font-medium text-[#15b7b9]"
              >
                {t(`days.${day}`)}
              </div>
            ))}
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const available = isDayAvailable(day);
              const isToday = isCurrentDay(day);
              return (
                <div
                  key={day}
                  className={cn(
                    'min-h-24 rounded-lg border p-1 transition-colors',
                    available
                      ? 'border-gray-200 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50 opacity-50',
                    isToday && 'border-2 border-[#15b7b9] bg-[#15b7b9]/5',
                  )}
                >
                  <div
                    className={cn(
                      'mb-1 text-sm font-medium',
                      isToday && 'font-bold text-[#15b7b9]',
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <Link
                        href={`/bookings/${event.id}`}
                        key={event.id}
                        className={cn(
                          'flex items-center gap-1 truncate rounded p-1 text-xs transition-colors hover:opacity-80',
                          getEventStatusColor(event.status),
                        )}
                      >
                        <span>{getEventType(event.eventTypeId)?.icon}</span>
                        {event.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold text-[#15b7b9]">
              {t('upcomingEvents')}
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-4 last:border-0">
                    <Link
                      href={`/bookings/${event.id}`}
                      className={cn(
                        'flex items-start gap-3 rounded-lg p-3 transition-colors hover:opacity-80',
                        getEventStatusColor(event.status),
                      )}
                    >
                      <div className="rounded-full bg-white/50 p-2">
                        <span>{getEventType(event.eventTypeId)?.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getEventTypeLabel(event.eventTypeId)}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(event.date).toLocaleTimeString(language, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {event.venue && (
                            <>
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {events.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full text-[#15b7b9] hover:bg-[#15b7b9]/10"
                    onClick={() => setShowAllEvents(!showAllEvents)}
                  >
                    {showAllEvents ? t('showLess') : t('viewAll')}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-gray-500">{t('noUpcomingEvents')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
