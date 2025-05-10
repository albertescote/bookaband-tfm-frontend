import { MusicGenre } from '@/service/backend/band/domain/musicGenre';

export interface BandWithDetails {
  id: string;
  name: string;
  genre: MusicGenre;
  members: {
    id: string;
    userName: string;
    imageUrl?: string;
  }[];
  imageUrl?: string;
}
