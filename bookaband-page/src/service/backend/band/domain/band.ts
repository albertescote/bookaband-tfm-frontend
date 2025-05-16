export interface Band {
  id: string;
  name: string;
  membersId: string[];
  genre: string;
  reviewCount: number;
  followers: number;
  following: number;
  rating?: number;
  imageUrl?: string;
  bio?: string;
}
