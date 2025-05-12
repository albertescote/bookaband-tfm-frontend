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
