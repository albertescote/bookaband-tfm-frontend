'use client';
import React from 'react';
import clsx from 'clsx';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition duration-200 focus:border-[#15b7b9] focus:ring-[#15b7b9]',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
