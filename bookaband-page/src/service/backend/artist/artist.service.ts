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
  bandSize: 'solo' | 'duo' | 'trio' | 'band';
  equipment: {
    hasSoundEquipment: boolean;
    hasLighting: boolean;
    hasMicrophone: boolean;
  };
  availableForEvents: {
    weddings: boolean;
    privateParties: boolean;
    festivals: boolean;
    restaurantsHotels: boolean;
    businesses: boolean;
  };
}

const ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'The Jazz Cats',
    genre: 'jazz',
    location: 'Barcelona',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80',
    featured: true,
    rating: 4.8,
    reviewCount: 127,
    bandSize: 'band',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: true,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: true,
      restaurantsHotels: true,
      businesses: true,
    },
  },
  {
    id: '2',
    name: 'Rocking Stones',
    genre: 'rock',
    location: 'Madrid',
    price: 150,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.5,
    reviewCount: 89,
    bandSize: 'band',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: true,
      hasMicrophone: false,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: true,
      restaurantsHotels: false,
      businesses: false,
    },
  },
  {
    id: '3',
    name: 'Pop Vibes',
    genre: 'pop',
    location: 'Valencia',
    price: 100,
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.2,
    reviewCount: 45,
    bandSize: 'duo',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: false,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: false,
      restaurantsHotels: true,
      businesses: false,
    },
  },
  {
    id: '4',
    name: 'Classical Quartet',
    genre: 'classical',
    location: 'Seville',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.9,
    reviewCount: 156,
    bandSize: 'trio',
    equipment: {
      hasSoundEquipment: false,
      hasLighting: false,
      hasMicrophone: false,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: false,
      restaurantsHotels: true,
      businesses: true,
    },
  },
  {
    id: '5',
    name: 'Electro Beats',
    genre: 'electronic',
    location: 'Bilbao',
    price: 180,
    image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80',
    rating: 4.6,
    reviewCount: 92,
    bandSize: 'solo',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: true,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: true,
      restaurantsHotels: true,
      businesses: true,
    },
  },
  {
    id: '6',
    name: 'Solo Sax',
    genre: 'jazz',
    location: 'Girona',
    price: 90,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.3,
    reviewCount: 67,
    bandSize: 'solo',
    equipment: {
      hasSoundEquipment: false,
      hasLighting: false,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: false,
      restaurantsHotels: true,
      businesses: false,
    },
  },
  {
    id: '7',
    name: 'Acoustic Duo',
    genre: 'pop',
    location: 'Tarragona',
    price: 120,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.7,
    reviewCount: 112,
    bandSize: 'duo',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: false,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: true,
      restaurantsHotels: true,
      businesses: false,
    },
  },
  {
    id: '8',
    name: 'Rock Trio',
    genre: 'rock',
    location: 'Lleida',
    price: 160,
    image: 'https://images.unsplash.com/photo-1565103420311-8cbbc3cd87b8',
    rating: 4.4,
    reviewCount: 78,
    bandSize: 'trio',
    equipment: {
      hasSoundEquipment: true,
      hasLighting: true,
      hasMicrophone: true,
    },
    availableForEvents: {
      weddings: true,
      privateParties: true,
      festivals: true,
      restaurantsHotels: false,
      businesses: false,
    },
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

  // If no filters are applied, return empty results
  if (
    filters &&
    Object.values(filters).some((value) => value && value.trim())
  ) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const artists = filteredArtists.slice(start, end);
    const hasMore = end < filteredArtists.length;
    const total = filteredArtists.length;
    return { artists, hasMore, total };
  }

  return { artists: [], hasMore: false, total: 0 };
}
