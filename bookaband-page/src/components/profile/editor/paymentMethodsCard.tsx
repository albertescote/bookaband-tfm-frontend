'use client';

import React from 'react';
import { CreditCard, PlusCircle } from 'lucide-react';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  lastFour: string;
  brand?: string;
  isDefault?: boolean;
}

interface PaymentMethodsCardProps {
  methods: PaymentMethod[];
  onAdd: () => void;
}

export default function PaymentMethodsCard({
  methods,
  onAdd,
}: PaymentMethodsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-[#15b7b9] hover:underline"
        >
          <PlusCircle className="h-4 w-4" />
          Add
        </button>
      </div>

      {methods.length === 0 ? (
        <p className="text-sm text-gray-500">No payment methods added yet.</p>
      ) : (
        <ul className="space-y-4">
          {methods.map((method) => (
            <li
              key={method.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#15b7b9]" />
                <span className="text-sm text-gray-700">
                  {method.brand || 'Card'} •••• {method.lastFour}
                </span>
                {method.isDefault && (
                  <span className="ml-2 rounded-full bg-[#15b7b9]/10 px-2 py-0.5 text-xs text-[#15b7b9]">
                    Default
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{method.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
