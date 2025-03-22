export interface UserBand {
  id: string;
  name: string;
  offer?: {
    id: string;
    bandId: string;
    price: number;
    visible: boolean;
    description?: string;
  };
}
