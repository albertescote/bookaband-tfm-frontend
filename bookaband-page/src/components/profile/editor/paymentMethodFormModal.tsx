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
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 transition-all">
          <Dialog.Title className="mb-4 text-xl font-semibold text-gray-800">
            {form.id
              ? t('paymentMethodModal.titleEdit')
              : t('paymentMethodModal.titleAdd')}
          </Dialog.Title>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('paymentMethodModal.aliasPlaceholder')}
              </label>
              <input
                type="text"
                value={form.alias || ''}
                onChange={(e) => handleChange('alias', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm transition focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isDefault || false}
                onChange={(e) => handleChange('isDefault', e.target.checked)}
                className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white transition-all checked:border-[#15b7b9] checked:bg-[#15b7b9] focus:outline-none focus:ring-2 focus:ring-[#15b7b9] focus:ring-offset-2"
              />
              {t('paymentMethodModal.setAsDefault')}
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-[#15b7b9] hover:underline"
            >
              {t('paymentMethodModal.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isModified || !isValid}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isModified && isValid
                  ? 'bg-[#15b7b9] text-white hover:scale-105 hover:bg-[#129da0]'
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
