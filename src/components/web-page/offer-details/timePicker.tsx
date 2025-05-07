import { FiCalendar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function TimePicker({
  date,
  time,
  setTime,
  handleBackToCalendar,
  generateTimeOptions,
  language,
  t,
}: {
  date: Date | null;
  time: string;
  setTime: (time: string) => void;
  handleBackToCalendar: () => void;
  generateTimeOptions: () => string[];
  language: string;
  t: (key: string) => string;
}) {
  return (
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
  );
}
