'use client';

import { useRef } from 'react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  className?: string;
  children: React.ReactNode;
}

export function FileUpload({
  onUpload,
  accept,
  className,
  children,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }

    e.target.value = '';
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        multiple
      />
    </>
  );
}
