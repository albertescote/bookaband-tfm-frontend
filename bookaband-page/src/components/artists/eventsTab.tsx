import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Music,
  X,
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import {
  ArtistDetails,
  Event,
} from '@/service/backend/artist/domain/artistDetails';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { WeeklyAvailability } from '@/service/backend/artist/domain/bandCatalogItem';

interface EventsTabProps {
  artist: ArtistDetails;
  language: string;
  eventTypes: EventType[];
}

export default function EventsTab({
  artist,
  language,
  eventTypes,
}: EventsTabProps) {
  const { t } = useTranslation(language, 'artists');

  const popupRef = useRef<HTMLDivElement | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [viewAll, setViewAll] = useState(false);
  const [eventPopup, setEventPopup] = useState({
    visible: false,
    events: [] as Event[],
    position: { x: 0, y: 0 },
    date: null as Date | null,
  });

  const events = useMemo(
    () => (artist.events ?? []).filter((e) => e.isPublic !== false),
    [artist.events],
  );

  const getLocalizedWeekdays = () => {
    const baseDate = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString(language, { weekday: 'narrow' });
    });
  };

  const weekdays = getLocalizedWeekdays();

  useEffect(() => {
    if (!eventPopup.visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };

    const handleScroll = () => closePopup();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [eventPopup.visible]);

  const closePopup = () =>
    setEventPopup((prev) => ({ ...prev, visible: false }));

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const getMonthDisplay = () =>
    `${currentMonth.toLocaleDateString(language, { month: 'short' })} ${currentMonth.getFullYear()}`;

  const formatEventTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString(language, {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getEventTypeLabel = (id: string) =>
    eventTypes.find((e) => e.id === id)?.label[language] || '';

  const eventDates = useMemo(() => {
    return events.reduce((acc: Record<string, Event[]>, event) => {
      const key = new Date(event.date).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const totalDays = firstDayOfWeek + lastDay.getDate();
    const totalRows = Math.ceil(totalDays / 7);
    const grid = [];

    for (let row = 0; row < totalRows; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        const dayIndex = row * 7 + col;
        const dayOffset = dayIndex - firstDayOfWeek;
        const date = new Date(year, month, 1 + dayOffset);
        const isCurrentMonth = date.getMonth() === month;
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        week.push({ date, isCurrentMonth, isToday });
      }
      grid.push(week);
    }
    return grid;
  }, [currentMonth]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, viewAll ? events.length : 3);
  }, [events, viewAll]);

  const handleDayClick = (day: { date: Date }, e: React.MouseEvent) => {
    const dateStr = day.date.toDateString();
    const dayEvents = eventDates[dateStr] || [];
    if (!dayEvents.length) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const container = (e.currentTarget as HTMLElement)
      .offsetParent as HTMLElement;
    const containerRect = container.getBoundingClientRect();

    const x = rect.left - containerRect.left + rect.width / 2 - 160;
    const y = rect.top - containerRect.top + rect.height + 8;

    setEventPopup({
      visible: true,
      events: dayEvents,
      position: { x, y },
      date: day.date,
    });
  };

  if (!events.length) {
    return (
      <p className="mt-4 text-sm text-gray-500">{t('noUpcomingEvents')}</p>
    );
  }
  return (
    <div className="relative mt-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {t('upcomingEvents')}
            </h3>
            {events.length > 3 && (
              <button
                onClick={() => setViewAll(!viewAll)}
                className="flex items-center text-sm font-medium text-[#15b7b9] hover:opacity-80"
              >
                {viewAll ? t('showLess') : t('viewAll')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="relative overflow-visible rounded-xl border border-[#e2f7f7] p-4 transition-all hover:shadow-lg"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-[#15b7b9]" />
                <div className="flex items-start pl-3">
                  <div className="mr-4 flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-gray-400">
                      {new Date(event.date).toLocaleDateString(language, {
                        month: 'short',
                      })}
                    </div>
                    <div className="text-2xl font-bold text-[#15b7b9]">
                      {new Date(event.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {event.name}
                      </h4>
                      <span className="rounded-full bg-[#15b7b9] px-2 py-1 text-xs text-white">
                        {getEventTypeLabel(event.eventTypeId)}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-[#15b7b9]" />
                        {formatEventTime(event.date)}
                      </div>
                      {event.city && (
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-[#15b7b9]" />
                          {event.venue ? `${event.venue}, ` : ''}
                          {event.city}, {event.country}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-visible rounded-xl shadow-lg">
          <div className="p-6 text-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">{t('availability')}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h4 className="px-2 font-medium text-gray-800">
                  {getMonthDisplay()}
                </h4>
                <button
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-4">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-2 grid grid-cols-7">
                {week.map((day, dayIndex) => {
                  const dateKey = day.date.toDateString();
                  const isEventDay = eventDates[dateKey]?.length > 0;
                  const isHovered = hoveredDay === dateKey;
                  const eventCount = eventDates[dateKey]?.length || 0;
                  const dayOfWeek = day.date.getDay();
                  const dayName = [
                    'sunday',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                  ][dayOfWeek] as keyof WeeklyAvailability;
                  const isAvailable = artist.weeklyAvailability[dayName];

                  return (
                    <div
                      key={dayIndex}
                      onClick={(e) => isAvailable && handleDayClick(day, e)}
                      onMouseEnter={() => setHoveredDay(dateKey)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`relative flex cursor-pointer items-center justify-center p-1 transition-all
    ${day.isCurrentMonth ? 'opacity-100' : 'opacity-30'}
    ${isAvailable === false ? 'pointer-events-none opacity-30' : ''}`}
                    >
                      <div
                        className={`relative z-10 flex items-center justify-center rounded-full transition-all ${
                          isEventDay ? 'h-12 w-12' : 'h-10 w-10'
                        } ${isHovered ? '-translate-y-1 shadow-md' : ''} ${
                          day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                        }`}
                        style={{
                          backgroundColor: isEventDay
                            ? '#e2f7f7'
                            : isHovered
                              ? '#f5f5f5'
                              : 'transparent',
                          border: isEventDay ? '2px solid #15b7b9' : 'none',
                        }}
                      >
                        {day.date.getDate()}
                        {isEventDay && (
                          <span
                            className="absolute -bottom-1 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: '#15b7b9' }}
                          >
                            {eventCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {eventPopup.visible && (
              <div
                ref={popupRef}
                className="absolute z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl"
                style={{
                  top: `${eventPopup.position.y}px`,
                  left: `${eventPopup.position.x}px`,
                }}
              >
                <div className="border-b border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-700">
                      {eventPopup.date?.toLocaleDateString(language, {
                        month: 'long',
                        day: 'numeric',
                      })}
                      <span className="ml-2 text-sm text-gray-500">
                        ({eventPopup.events.length} {t('events')})
                      </span>
                    </h5>
                    <button
                      onClick={closePopup}
                      className="rounded-full p-1 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <ul className="max-h-60 divide-y divide-gray-100 overflow-y-auto">
                  {eventPopup.events.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2f7f7]">
                        <Music className="h-4 w-4 text-[#15b7b9]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-gray-900">
                            {event.name}
                          </h4>
                        </div>
                        {event.venue && (
                          <div className="text-xs text-gray-500">
                            {event.venue}
                          </div>
                        )}
                      </div>
                      <div className="ml-auto text-sm font-medium text-[#15b7b9]">
                        {formatEventTime(event.date)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
