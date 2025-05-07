import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';

export default function CalendarPicker({
  date,
  today,
  bookedDates,
  isDateBooked,
  handleDateSelection,
  language,
}: {
  date: Date | null;
  today: Date;
  bookedDates: Date[];
  isDateBooked: (date: Date) => boolean;
  handleDateSelection: (date: Date | null) => void;
  language: string;
}) {
  return (
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
        onChange={handleDateSelection}
        minDate={today}
        inline
        excludeDates={bookedDates}
        className="rounded-lg border border-gray-200 p-2 shadow-sm"
        dayClassName={(date) => {
          if (isDateBooked(date)) return '!text-red-500';
          if (date < today) return '!text-gray-400';
          return '!text-green-500';
        }}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              &larr;
            </button>
            <span className="text-lg font-semibold">
              {new Date(date).toLocaleDateString(language, {
                year: 'numeric',
                month: 'long',
              })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              &rarr;
            </button>
          </div>
        )}
      />
    </motion.div>
  );
}
