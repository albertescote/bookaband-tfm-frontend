import { MusicGenre } from '@/service/backend/band/domain/musicGenre';

import { BandRole } from '@/service/backend/band/domain/bandRole';

export interface Band {
  id: string;
  name: string;
  genre: MusicGenre;
  members: { id: string; role: BandRole }[];
  followers: number;
  following: number;
  reviewCount: number;
  rating?: number;
  imageUrl?: string;
  bio?: string;
}
