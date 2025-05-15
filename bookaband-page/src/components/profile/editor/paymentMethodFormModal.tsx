'use client';

import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { PaymentMethod } from '@/service/backend/user/domain/paymentMethod';
import { useTranslation } from '@/app/i18n/client';

interface PaymentMethodFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: Partial<PaymentMethod>;
  onSave: (data: Partial<PaymentMethod>) => void;
  language: string;
}

export default function PaymentMethodFormModal({
  open,
  onClose,
  initialData,
  onSave,
  language,
}: PaymentMethodFormModalProps) {
  const { t } = useTranslation(language, 'profile');
  const [form, setForm] = useState<Partial<PaymentMethod>>({});

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (key: keyof PaymentMethod, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.alias) return;
    onSave(form);
    onClose();
  };

  const isModified = JSON.stringify(form) !== JSON.stringify(initialData);
  const isValid = !!form.alias;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-bold text-gray-800">
            {form.id
              ? t('paymentMethodModal.titleEdit')
              : t('paymentMethodModal.titleAdd')}
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('paymentMethodModal.aliasPlaceholder')}
              value={form.alias || ''}
              onChange={(e) => handleChange('alias', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isDefault || false}
                onChange={(e) => handleChange('isDefault', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#15b7b9] focus:ring-[#15b7b9]"
              />
              {t('paymentMethodModal.setAsDefault')}
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:underline"
            >
              {t('paymentMethodModal.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isModified || !isValid}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isModified && isValid
                  ? 'bg-[#15b7b9] text-white hover:bg-[#129da0]'
                  : 'cursor-not-allowed bg-gray-300 text-white'
              }`}
            >
              {t('paymentMethodModal.save')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
