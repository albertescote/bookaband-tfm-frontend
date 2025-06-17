import { getContractById } from '@/service/backend/documents/service/contract.service';
import ContractDetail from '../../../../../components/documents/contract/ContractDetail';

interface PageProps {
  params: Promise<{
    lng: string;
    id: string;
  }>;
}

export default async function ContractDetailPage({ params }: PageProps) {
  const { lng: language, id: contractId } = await params;
  const contract = await getContractById(contractId);

  if (!contract || 'error' in contract) {
    return null;
  }

  return <ContractDetail contract={contract} language={language} />;
}
