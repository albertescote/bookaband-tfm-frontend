'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  t: (key: string) => string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  t,
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value.getHours().toString().padStart(2, '0'),
  );
  const [selectedMinute, setSelectedMinute] = useState(
    String(Math.round(value.getMinutes() / 5) * 5).padStart(2, '0'),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0'),
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, '0'),
  );

  const handleTimeChange = (hour: string, minute: string) => {
    const newDate = new Date(value);
    newDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    onChange(newDate);
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
    handleTimeChange(hour, selectedMinute);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
    handleTimeChange(selectedHour, minute);
  };

  const displayValue = `${selectedHour}:${selectedMinute}`;

  const ScrollableColumn = ({
    items,
    selected,
    onSelect,
    label,
  }: {
    items: string[];
    selected: string;
    onSelect: (value: string) => void;
    label: string;
  }) => {
    const columnRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isOpen && selectedRef.current && columnRef.current) {
        const container = columnRef.current;
        const selectedElement = selectedRef.current;
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();

        const scrollTop =
          selectedElement.offsetTop -
          containerRect.height / 2 +
          selectedRect.height / 2;
        container.scrollTop = scrollTop;
      }
    }, [isOpen, selected]);

    return (
      <div className="flex flex-col items-center">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div
          ref={columnRef}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent h-40 overflow-y-auto"
        >
          <div className="flex flex-col">
            {items.map((item) => (
              <button
                key={item}
                ref={item === selected ? selectedRef : null}
                type="button"
                onClick={() => onSelect(item)}
                className={`mx-1 my-0.5 rounded-lg px-4 py-2 text-sm transition-all duration-200 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9] ${
                  selected === item
                    ? 'scale-105 bg-[#15b7b9] text-white shadow-lg'
                    : 'hover:scale-102 text-gray-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-left transition-all duration-300 ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            : isOpen
              ? 'border-[#15b7b9] bg-[#15b7b9]/5'
              : 'border-gray-300 hover:border-[#15b7b9]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock
              className={`h-4 w-4 ${
                isOpen ? 'text-[#15b7b9]' : 'text-gray-400'
              }`}
            />
            <span
              className={`${
                !value ? 'text-gray-400' : 'text-gray-900'
              } text-sm font-medium`}
            >
              {displayValue}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#15b7b9]' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl duration-300 animate-in slide-in-from-top-2">
          <div className="flex justify-center space-x-6">
            <ScrollableColumn
              items={hours}
              selected={selectedHour}
              onSelect={handleHourChange}
              label={t('hour')}
            />

            <div className="flex items-center">
              <div className="h-32 w-px bg-gray-200"></div>
            </div>

            <ScrollableColumn
              items={minutes}
              selected={selectedMinute}
              onSelect={handleMinuteChange}
              label={t('minute')}
            />
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('selected')}:{' '}
                <span className="font-medium text-gray-900">
                  {displayValue}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#15b7b9]/90"
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
