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
  try {
    const { lng, id } = await params;
    const invoice = await getInvoiceById(id);

    if ('error' in invoice) {
      redirect(`/${lng}/documents`);
    }

    return <InvoiceDetail invoice={invoice} language={lng} />;
  } catch (error) {
    const { lng } = await params;
    redirect(`/${lng}/documents`);
  }
}
