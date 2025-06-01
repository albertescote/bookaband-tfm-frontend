import { BandRole } from '@/service/backend/band/domain/bandRole';

export interface Band {
  id: string;
  name: string;
  members: { id: string; role: BandRole }[];
  musicalStyleIds: string[];
  imageUrl?: string;
  bio?: string;
}
