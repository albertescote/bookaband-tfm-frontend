'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';

interface InvoiceDetailProps {
  invoice: Invoice;
  language: string;
}

export default function InvoiceDetail({
  invoice,
  language,
}: InvoiceDetailProps) {
  const router = useRouter();
  const { t } = useTranslation(language, 'documents');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('back')}
        </button>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('invoiceDetails')}
              </h3>
              <button
                onClick={() => window.open(invoice.fileUrl, '_blank')}
                className="inline-flex items-center rounded-md border border-transparent bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#15b7b9]/90 focus:outline-none focus:ring-2 focus:ring-[#15b7b9] focus:ring-offset-2"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('download')}
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {t('amount')}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {invoice.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </dd>
              </div>

              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {t('status')}
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      invoice.status,
                    )}`}
                  >
                    {t(`status.${invoice.status.toLowerCase()}`)}
                  </span>
                </dd>
              </div>

              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {t('createdAt')}
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {format(new Date(invoice.createdAt), 'PPP', {
                    locale: language === 'es' ? es : ca,
                  })}
                </dd>
              </div>

              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {t('updatedAt')}
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {format(new Date(invoice.updatedAt), 'PPP', {
                    locale: language === 'es' ? es : ca,
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
