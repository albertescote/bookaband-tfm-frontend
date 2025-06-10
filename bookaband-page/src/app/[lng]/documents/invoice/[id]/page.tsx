import { getInvoiceById } from '@/service/backend/documents/service/invoice.service';
import InvoiceDetail from '../../../../../components/documents/invoice/InvoiceDetail';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    lng: string;
    id: string;
  };
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  try {
    const invoice = await getInvoiceById(params.id);

    if ('error' in invoice) {
      redirect(`/${params.lng}/documents`);
    }

    return <InvoiceDetail invoice={invoice} language={params.lng} />;
  } catch (error) {
    redirect(`/${params.lng}/documents`);
  }
}
