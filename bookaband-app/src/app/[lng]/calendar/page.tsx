'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'performance' | 'rehearsal' | 'meeting';
  location: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Festival Performance',
    date: '2024-07-15',
    time: '19:00',
    type: 'performance',
    location: 'Central Park',
  },
  {
    id: '2',
    title: 'Band Rehearsal',
    date: '2024-03-20',
    time: '15:00',
    type: 'rehearsal',
    location: 'Studio A',
  },
  {
    id: '3',
    title: 'Venue Meeting',
    date: '2024-03-25',
    time: '11:00',
    type: 'meeting',
    location: 'Jazz Club',
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    return mockEvents.filter(
      (event) =>
        new Date(event.date).getDate() === day &&
        new Date(event.date).getMonth() === currentDate.getMonth() &&
        new Date(event.date).getFullYear() === currentDate.getFullYear(),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button className="flex items-center rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#15b7b9]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const events = getEventsForDay(day);
            return (
              <div
                key={day}
                className="min-h-24 rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">{day}</span>
                <div className="mt-1 space-y-1">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded px-2 py-1 text-xs ${
                        event.type === 'performance'
                          ? 'bg-blue-100 text-blue-800'
                          : event.type === 'rehearsal'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
