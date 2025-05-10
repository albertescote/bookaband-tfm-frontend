export interface Artist {
  id: string;
  name: string;
  genre: string;
  location: string;
  price?: number;
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
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
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
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '7',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '8',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '9',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '10',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '11',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '12',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '13',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '14',
    name: 'Solo Sax',
    genre: 'Jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.8,
    reviewCount: 127,
  },
];

export async function fetchAllArtists(
  page: number = 1,
  pageSize: number = 10,
): Promise<{ artists: Artist[]; hasMore: boolean; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const artists = ARTISTS.slice(start, end);
  const hasMore = end < ARTISTS.length;
  const total = ARTISTS.length;
  return { artists, hasMore, total };
}

export async function fetchFilteredArtists(
  page: number = 1,
  pageSize: number = 10,
  filters?: { location?: string; date?: string; searchQuery?: string },
): Promise<{ artists: Artist[]; hasMore: boolean; total: number }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filteredArtists = ARTISTS;
  if (filters) {
    if (filters.location && filters.location.trim()) {
      filteredArtists = filteredArtists.filter((artist) =>
        artist.location
          ?.toLowerCase()
          .includes(filters.location!.trim().toLowerCase()),
      );
    }
    if (filters.searchQuery && filters.searchQuery.trim()) {
      filteredArtists = filteredArtists.filter(
        (artist) =>
          artist.name
            ?.toLowerCase()
            .includes(filters.searchQuery!.trim().toLowerCase()) ||
          artist.genre
            ?.toLowerCase()
            .includes(filters.searchQuery!.trim().toLowerCase()),
      );
    }
    // Date filter can be added here if needed
  }
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const artists = filteredArtists.slice(start, end);
  const hasMore = end < filteredArtists.length;
  const total = filteredArtists.length;
  return { artists, hasMore, total };
}
