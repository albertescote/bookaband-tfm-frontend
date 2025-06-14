import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';

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
  showSelectAll?: boolean;
  selectAllLabel?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  className,
  hideRemoveButton = false,
  showSelectAll = false,
  selectAllLabel = 'Select all',
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

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  const getOptionLabel = (optionValue: string) => {
    return (
      options.find((opt) => opt.value === optionValue)?.label || optionValue
    );
  };

  const getOptionIcon = (optionValue: string) => {
    return options.find((opt) => opt.value === optionValue)?.icon;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-[40px] w-full items-center rounded-md border px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
          isOpen && 'ring-2 ring-offset-2',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {value.length > 0 ? (
            value.map((v) => (
              <span
                key={v}
                className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
              >
                {getOptionIcon(v) && (
                  <span className="text-primary/70">{getOptionIcon(v)}</span>
                )}
                {getOptionLabel(v)}
                {!hideRemoveButton && (
                  <button
                    type="button"
                    className="hover:bg-primary/20 inline-flex h-4 w-4 items-center justify-center rounded-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(v);
                    }}
                  >
                    <X className="h-3 w-3" />
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
            'text-muted-foreground h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180 transform',
          )}
        />
      </div>

      {isOpen && (
        <div className="text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
          {showSelectAll && (
            <div
              className={cn(
                'flex cursor-pointer items-center justify-between border-b px-3 py-2 text-sm font-medium hover:bg-gray-50',
                value.length === options.length && 'bg-primary/5 text-primary',
              )}
              onClick={handleSelectAll}
            >
              <span>{selectAllLabel}</span>
              {value.length === options.length && (
                <Check className="text-primary h-4 w-4" />
              )}
            </div>
          )}
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-50',
                value.includes(option.value) && 'bg-primary/5 text-primary',
              )}
              onClick={() => toggleOption(option.value)}
            >
              <div className="flex items-center gap-2">
                {option.icon && (
                  <span className="text-muted-foreground">{option.icon}</span>
                )}
                {option.label}
              </div>
              {value.includes(option.value) && (
                <Check className="text-primary h-4 w-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
