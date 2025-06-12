import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selectedDates: Date[];
  onSelect: (dates: Date[]) => void;
  className?: string;
}

export function Calendar({
  selectedDates,
  onSelect,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const isSelected = selectedDates.some(
      (date) =>
        date.getDate() === newDate.getDate() &&
        date.getMonth() === newDate.getMonth() &&
        date.getFullYear() === newDate.getFullYear(),
    );

    if (isSelected) {
      onSelect(
        selectedDates.filter((date) => date.getTime() !== newDate.getTime()),
      );
    } else {
      onSelect([...selectedDates, newDate]);
    }
  };

  const renderDays = () => {
    const days = [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    days.push(
      <div key="header" className="flex items-center justify-between p-2">
        <button
          onClick={handlePrevMonth}
          className="rounded p-1 hover:bg-gray-100"
        >
          ←
        </button>
        <span className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={handleNextMonth}
          className="rounded p-1 hover:bg-gray-100"
        >
          →
        </button>
      </div>,
    );

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.push(
      <div key="days" className="grid grid-cols-7 gap-1 p-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>,
    );

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const isSelected = selectedDates.some(
        (selectedDate) =>
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear(),
      );

      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            'rounded p-2 text-center text-sm hover:bg-gray-100',
            isSelected && 'bg-primary hover:bg-primary/90 text-white',
          )}
        >
          {day}
        </button>,
      );
    }

    days.push(
      <div key="calendar" className="grid grid-cols-7 gap-1 p-2">
        {calendarDays}
      </div>,
    );

    return days;
  };

  return (
    <div
      className={cn('w-full rounded-lg border bg-white shadow-sm', className)}
    >
      {renderDays()}
    </div>
  );
}
