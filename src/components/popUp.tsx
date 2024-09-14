import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import { useTranslation } from '@/app/i18n/client';

interface PopupProps {
  title: string;
  description: string;
  language: string;
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({
  title,
  description,
  language,
  onClose,
}) => {
  const { t } = useTranslation(language, 'pre-registration');
  return (
    <Dialog defaultOpen>
      <DialogContent className="w-full max-w-md rounded-lg bg-[#f0f9ff] p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4 text-lg">
          {description}
        </DialogDescription>
        <DialogFooter className="mt-6">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default PopUp;
