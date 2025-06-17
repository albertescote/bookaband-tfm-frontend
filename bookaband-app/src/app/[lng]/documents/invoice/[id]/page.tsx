import { getInvoiceById } from '@/service/backend/documents/service/invoice.service';
import InvoiceDetail from '../../../../../components/documents/invoice/InvoiceDetail';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    lng: string;
    id: string;
  }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { lng: language, id: invoiceId } = await params;
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice || 'error' in invoice) {
    redirect(`/${language}/documents`);
  }

  return <InvoiceDetail invoice={invoice} language={language} />;
}
