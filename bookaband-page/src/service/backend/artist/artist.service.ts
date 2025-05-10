export interface Artist {
  id: string;
  name: string;
  genre: string;
  location: string;
  price: number;
  image: string;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

const ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'The Jazz Cats',
    genre: 'Jazz',
    location: 'Barcelona',
    price: 120,
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80',
    featured: true,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    name: 'Rocking Stones',
    genre: 'Rock',
    location: 'Madrid',
    price: 150,
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '3',
    name: 'Pop Vibes',
    genre: 'Pop',
    location: 'Valencia',
    price: 100,
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '4',
    name: 'Classical Quartet',
    genre: 'Classical',
    location: 'Seville',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '5',
    name: 'Electro Beats',
    genre: 'Electronic',
    location: 'Bilbao',
    price: 180,
    image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '6',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.8,
    reviewCount: 127,
  },
];

export async function fetchArtists(): Promise<Artist[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ARTISTS;
}
