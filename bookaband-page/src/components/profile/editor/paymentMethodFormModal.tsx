'use client';

import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { PaymentMethod } from '@/service/backend/user/domain/paymentMethod';

interface PaymentMethodFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: Partial<PaymentMethod>;
  onSave: (data: Partial<PaymentMethod>) => void;
}

export default function PaymentMethodFormModal({
  open,
  onClose,
  initialData,
  onSave,
}: PaymentMethodFormModalProps) {
  const [form, setForm] = useState<Partial<PaymentMethod>>({});

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (key: keyof PaymentMethod, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  if (!initialData || !initialData.id) {
    return (
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-lg font-bold text-gray-800">
              TBD
            </Dialog.Title>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-bold text-gray-800">
            {form.id ? 'Edit Payment Method' : 'Add Payment Method'}
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Alias"
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
              Set as default
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full bg-[#15b7b9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#129da0]"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
