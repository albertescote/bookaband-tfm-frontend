import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Music } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

export default function EventsTab({ artist, language, eventTypes }) {
  const { t } = useTranslation(language, 'artists');
  // Filter only public events
  const events = (artist.events ?? []).filter(
    (event) => event.isPublic !== false,
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate total cells needed (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    // Calculate rows needed (weeks)
    const totalRows = Math.ceil(totalDays / 7);

    // Generate calendar grid
    const calendarGrid = [];
    let dayCounter = 1;
    let currentDate = new Date(year, month, dayCounter);

    // Create week rows
    for (let row = 0; row < totalRows; row++) {
      const week = [];

      // Create day cells for each week
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDayOfWeek) {
          // Previous month days
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const prevMonthDay = prevMonthLastDay - (firstDayOfWeek - col - 1);
          week.push({
            date: new Date(year, month - 1, prevMonthDay),
            isCurrentMonth: false,
            isToday: false,
          });
        } else if (dayCounter > lastDay.getDate()) {
          // Next month days
          const nextMonthDay = dayCounter - lastDay.getDate();
          week.push({
            date: new Date(year, month + 1, nextMonthDay),
            isCurrentMonth: false,
            isToday: false,
          });
          dayCounter++;
        } else {
          // Current month days
          currentDate = new Date(year, month, dayCounter);
          const today = new Date();

          week.push({
            date: currentDate,
            isCurrentMonth: true,
            isToday:
              currentDate.getDate() === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear(),
          });

          dayCounter++;
        }
      }

      calendarGrid.push(week);
    }

    return calendarGrid;
  }, [currentMonth]);

  // Map events to dates for highlighting in calendar
  const eventDates = useMemo(() => {
    return events.reduce((acc, event) => {
      const date = new Date(event.date);
      const dateStr = date.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    }, {});
  }, [events]);

  // Function to format date in a readable way
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to format time
  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Change month handlers
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Get events for selected date
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const selectedStr = selectedDate.toDateString();
    return eventDates[selectedStr] || [];
  }, [selectedDate, eventDates]);

  // Get upcoming events, sorted by date
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, viewAll ? events.length : 3);
  }, [events, viewAll]);

  // First letter of each day name
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get the month display as an abbreviated format
  const getMonthDisplay = () => {
    const month = currentMonth.toLocaleDateString(language, { month: 'short' });
    const year = currentMonth.getFullYear();
    return `${month} ${year}`;
  };

  if (events.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">{t('noUpcomingEvents')}</p>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left side: Calendar with Modern Design */}
        <div
          className="overflow-hidden rounded-xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #15b7b9 0%, #11999E 100%)',
          }}
        >
          {/* Calendar Header with Gradient Background */}
          <div className="p-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">{t('availability')}</h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all duration-200 hover:bg-opacity-30"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>

                <h4 className="px-2 font-medium text-white">
                  {getMonthDisplay()}
                </h4>

                <button
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all duration-200 hover:bg-opacity-30"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-white text-opacity-80"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Days with White Background */}
          <div className="rounded-t-3xl bg-white p-4">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="mb-2 grid grid-cols-7">
                {week.map((day, dayIndex) => {
                  const dateKey = day.date.toDateString();
                  const isEventDay = eventDates[dateKey]?.length > 0;
                  const isSelected =
                    selectedDate && dateKey === selectedDate.toDateString();
                  const isHovered = hoveredDay === dateKey;

                  return (
                    <div
                      key={dayIndex}
                      onClick={() => setSelectedDate(day.date)}
                      onMouseEnter={() => setHoveredDay(dateKey)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`
                        relative flex cursor-pointer items-center justify-center p-1 transition-all duration-200
                        ${!day.isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                      `}
                    >
                      <div
                        className={`
                          relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                          transition-all duration-200
                          ${isSelected ? 'text-white' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                          ${(isSelected || isHovered) && '-translate-y-1 transform shadow-md'}
                        `}
                        style={{
                          backgroundColor: isSelected
                            ? '#15b7b9'
                            : isHovered
                              ? '#e2f7f7'
                              : 'transparent',
                          boxShadow:
                            isSelected || isHovered
                              ? '0 4px 8px rgba(21, 183, 185, 0.3)'
                              : 'none',
                        }}
                      >
                        {day.date.getDate()}
                        {isEventDay && !isSelected && (
                          <span
                            className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                            style={{ backgroundColor: '#15b7b9' }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Events list */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {t('upcomingEvents')}
            </h3>
            {events.length > 3 && (
              <button
                onClick={() => setViewAll(!viewAll)}
                className="flex items-center text-sm font-medium transition-opacity duration-200 hover:opacity-80"
                style={{ color: '#15b7b9' }}
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
                className="group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: '#e2f7f7' }}
              >
                {/* Decorative element */}
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: '#15b7b9' }}
                />

                <div className="flex items-start pl-3">
                  <div className="mr-4 flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-gray-400">
                      {new Date(event.date).toLocaleDateString(language, {
                        month: 'short',
                      })}
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: '#15b7b9' }}
                    >
                      {new Date(event.date).getDate()}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {event.name}
                    </h4>

                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock
                          className="mr-2 h-4 w-4"
                          style={{ color: '#15b7b9' }}
                        />
                        {formatEventTime(event.date)}
                      </div>

                      {event.city && (
                        <div className="flex items-center text-gray-600">
                          <MapPin
                            className="mr-2 h-4 w-4"
                            style={{ color: '#15b7b9' }}
                          />
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

          {/* Selected date events */}
          {selectedDate && (
            <div className="mt-8">
              <h4
                className="mb-4 font-semibold text-gray-800"
                style={{ color: '#15b7b9' }}
              >
                {selectedDate.toLocaleDateString(language, {
                  month: 'long',
                  day: 'numeric',
                })}
                <span className="ml-2 font-normal text-gray-600">
                  {selectedDayEvents.length
                    ? `(${selectedDayEvents.length} ${t('events')})`
                    : `(${t('noEvents')})`}
                </span>
              </h4>

              {selectedDayEvents.length > 0 && (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl bg-gray-50">
                  {selectedDayEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-gray-100"
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: '#e2f7f7' }}
                      >
                        <Music
                          className="h-4 w-4"
                          style={{ color: '#15b7b9' }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{event.name}</div>
                        {event.venue && (
                          <div className="text-xs text-gray-500">
                            {event.venue}
                          </div>
                        )}
                      </div>
                      <div
                        className="ml-auto text-sm font-medium"
                        style={{ color: '#15b7b9' }}
                      >
                        {formatEventTime(event.date)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
