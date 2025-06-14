import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SingleSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SingleSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          'w-full justify-between font-normal',
          !value && 'text-muted-foreground',
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedOption ? (
          <div className="flex items-center gap-2">
            {selectedOption.icon}
            {selectedOption.label}
          </div>
        ) : (
          placeholder
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer select-none items-center px-4 py-2',
                value === option.value && 'bg-accent text-accent-foreground',
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
              {value === option.value && <Check className="ml-auto h-4 w-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
