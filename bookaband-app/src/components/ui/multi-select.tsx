import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  hideRemoveButton?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  className,
  hideRemoveButton = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getOptionLabel = (optionValue: string) => {
    return options.find((opt) => opt.value === optionValue)?.label || optionValue;
  };

  const getOptionIcon = (optionValue: string) => {
    return options.find((opt) => opt.value === optionValue)?.icon;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className="border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-[40px] w-full items-center rounded-md border px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {value.length > 0 ? (
            value.map((v) => (
              <span
                key={v}
                className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
              >
                {getOptionIcon(v) && (
                  <span className="mr-1">{getOptionIcon(v)}</span>
                )}
                {getOptionLabel(v)}
                {!hideRemoveButton && (
                  <button
                    type="button"
                    className="hover:bg-primary/20 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(v);
                    }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180 transform',
          )}
        />
      </div>

      {isOpen && (
        <div className="text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100',
                value.includes(option.value) && 'bg-gray-50 text-gray-900',
              )}
              onClick={() => toggleOption(option.value)}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
