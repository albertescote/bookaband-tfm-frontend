import { MusicGenre } from '@/service/backend/band/domain/musicGenre';
import { BandRole } from '@/service/backend/band/domain/bandRole';

export interface BandWithDetails {
  id: string;
  name: string;
  genre: MusicGenre;
  members: {
    id: string;
    userName: string;
    imageUrl?: string;
    role: BandRole;
  }[];
  imageUrl?: string;
}
