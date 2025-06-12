'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Download, FileText } from 'lucide-react';
import { Invoice } from '@/service/backend/documents/domain/invoice';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import {
  getInvoiceById,
  payInvoice,
} from '@/service/backend/documents/service/invoice.service';
import { toast } from 'sonner';

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
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(invoice);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(invoice.fileUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [invoice.fileUrl]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
        };
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
        };
      case 'failed':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          text: 'text-red-700',
          border: 'border-red-200',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
        };
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      setProcessing(true);
      await payInvoice(currentInvoice.id);
      toast.success(t('marked-as-paid'));

      const updatedInvoice = await getInvoiceById(currentInvoice.id);
      if (!('error' in updatedInvoice)) {
        setCurrentInvoice(updatedInvoice);
      }
    } catch (error) {
      toast.error(t('error-marking-paid'));
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  const statusConfig = getStatusColor(currentInvoice.status);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => router.push(`/${language}/documents`)}
          className="flex items-center text-gray-600 hover:text-[#15b7b9]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('back')}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-[#15b7b9]" />
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('invoices')}
            </h1>
          </div>
          <a
            href={currentInvoice.fileUrl}
            download
            className="flex items-center rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#15b7b9]/90"
          >
            <Download className="mr-2 h-5 w-5" />
            {t('download')}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                {t('invoiceDetails')}
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('amount')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {currentInvoice.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('status')}
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {t(`status.${currentInvoice.status.toLowerCase()}`)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('createdAt')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(currentInvoice.createdAt), 'PPpp', {
                      locale: language === 'es' ? es : ca,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t('updatedAt')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(new Date(currentInvoice.updatedAt), 'PPpp', {
                      locale: language === 'es' ? es : ca,
                    })}
                  </dd>
                </div>
                {currentInvoice.status.toLowerCase() === 'pending' && (
                  <div className="mt-6">
                    <button
                      onClick={handleMarkAsPaid}
                      disabled={processing}
                      className="w-full transform rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300 hover:from-emerald-100 hover:to-green-100 hover:shadow-md disabled:opacity-50"
                    >
                      <div className="flex items-center justify-center">
                        <Check className="mr-2 h-5 w-5" />
                        {processing ? t('processing') : t('mark-as-paid')}
                      </div>
                    </button>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="h-[calc(100vh-12rem)] w-full">
              {pdfDataUrl ? (
                <iframe
                  src={pdfDataUrl}
                  className="h-full w-full border-0"
                  title="Invoice PDF"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500">{t('loading')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
