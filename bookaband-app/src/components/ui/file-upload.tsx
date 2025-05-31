import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('bands');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpload(files);
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed p-6 text-center',
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          {isDragging ? (
            <p>{t('form.multimedia.dragAndDrop')}</p>
          ) : (
            <p>{t('form.multimedia.dragAndDrop')}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('form.multimedia.selectFiles')}
        </Button>
      </div>
    </div>
  );
}
