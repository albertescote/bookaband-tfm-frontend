'use client';

import React from 'react';
import { CheckCircle2, Clock, ReceiptText, XCircle } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import {
  Invoice,
  InvoiceStatus,
} from '@/service/backend/documents/domain/invoice';

interface InvoicesCardProps {
  invoices: Invoice[];
  language: string;
}

export default function InvoicesCard({
  invoices,
  language,
}: InvoicesCardProps) {
  const { t } = useTranslation(language, 'documents');

  const statusStyles: Record<
    InvoiceStatus,
    { label: string; icon: JSX.Element; color: string }
  > = {
    PAID: {
      label: t('invoiceStatus.paid'),
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      color: 'text-green-600 bg-green-100',
    },
    PENDING: {
      label: t('invoiceStatus.pending'),
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      color: 'text-yellow-600 bg-yellow-100',
    },
    FAILED: {
      label: t('invoiceStatus.failed'),
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      color: 'text-red-600 bg-red-100',
    },
  };

  return (
    <div className="min-h-40 rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <ReceiptText className="h-5 w-5 text-[#15b7b9]" />
        <h2 className="text-lg font-semibold text-gray-800">{t('invoices')}</h2>
      </div>

      {invoices.length === 0 ? (
        <p className="text-sm text-gray-500">{t('noInvoices')}</p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {invoices.map((invoice) => {
            const status = statusStyles[invoice.status];
            return (
              <li
                key={invoice.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-700">#{invoice.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(invoice.date).toLocaleDateString(language)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">
                    €{invoice.amount.toFixed(2)}
                  </span>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
