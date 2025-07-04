'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { CreditCard, PlusCircle } from 'lucide-react';
import { PaymentMethod } from '@/service/backend/user/domain/paymentMethod';
import {
  createPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
} from '@/service/backend/user/service/paymentMethod.service';
import PaymentMethodFormModal from '@/components/profile/editor/paymentMethodFormModal';
import { useTranslation } from '@/app/i18n/client';

interface PaymentMethodsCardProps {
  methods: PaymentMethod[];
  setError: Dispatch<SetStateAction<boolean>>;
  language: string;
}

const brandLogo = (brand?: string): JSX.Element | null => {
  switch ((brand || '').toLowerCase()) {
    case 'visa':
      return <img src="/assets/visa-logo.svg" alt="Visa" className="h-10" />;
    case 'mastercard':
      return (
        <img
          src="/assets/mastercard-logo.svg"
          alt="Mastercard"
          className="h-10"
        />
      );
    default:
      return null;
  }
};

export default function PaymentMethodsCard({
  methods,
  setError,
  language,
}: PaymentMethodsCardProps) {
  const { t } = useTranslation(language, 'profile');

  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(methods);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const handleSave = async (data: Partial<PaymentMethod>) => {
    try {
      if (data.id) {
        const result = await updatePaymentMethod(
          data.id,
          data.isDefault ?? false,
          data.alias,
        );
        if ('error' in result) {
          setError(true);
          return;
        }
        setPaymentMethods((prev) =>
          prev.map((m) => (m.id === result.id ? result : m)),
        );
      } else {
        const { id, ...body } = data;
        const result = await createPaymentMethod(body as any);
        if ('error' in result) {
          setError(true);
          return;
        }
        setPaymentMethods((prev) => [...prev, result]);
      }

      setEditingMethod(null);
      setShowModal(false);
    } catch {
      setError(true);
    }
  };

  const handleDelete = (id: string) => {
    deletePaymentMethod(id)
      .then(() => {
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
      })
      .catch(() => setError(true));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#15b7b9]" />
          <h2 className="text-lg font-semibold text-gray-800">
            {t('paymentMethods')}
          </h2>
        </div>
        <button
          onClick={() => {
            setEditingMethod(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1 text-sm text-[#15b7b9] hover:underline"
        >
          <PlusCircle className="h-4 w-4" />
          {t('paymentMethodsCard.add')}
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <p className="text-sm text-gray-500">
          {t('paymentMethodsCard.noMethods')}
        </p>
      ) : (
        <ul className="space-y-4">
          {paymentMethods.map((method) => (
            <li
              key={method.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <div className="mb-2 flex justify-between">
                <div className="text-sm font-semibold text-gray-600">
                  {t(`typeLabels.${method.type}`)}
                </div>
                <div>
                  {method.alias && (
                    <span className="ml-1 text-sm italic text-gray-500">
                      {method.alias}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  {brandLogo(method.brand)}
                  <span className="text-sm text-gray-700">
                    •••• {method.lastFour}
                  </span>
                  {method.isDefault && (
                    <span className="ml-2 rounded-full bg-[#15b7b9]/10 px-2 py-0.5 text-xs text-[#15b7b9]">
                      {t('paymentMethodsCard.default')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <button
                    onClick={() => {
                      setEditingMethod(method);
                      setShowModal(true);
                    }}
                    className="text-[#15b7b9] hover:underline"
                  >
                    {t('paymentMethodsCard.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-red-500 hover:underline"
                  >
                    {t('paymentMethodsCard.delete')}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PaymentMethodFormModal
        language={language}
        open={showModal}
        initialData={editingMethod ?? {}}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
