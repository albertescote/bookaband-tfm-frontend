interface PageParams {
  params: {
    lng: string;
  };
}

interface Offer {
  id: number;
  musicianName: string;
  genre: string;
  rate: string;
  availability: string;
  imageUrl: string;
}

// Sample data for offers with images
const offers: Offer[] = [
  {
    id: 1,
    musicianName: 'John Doe',
    genre: 'Jazz',
    rate: '$100/hour',
    availability: 'Available for events',
    imageUrl: '/assets/musicBand1.jpg',
  },
  {
    id: 2,
    musicianName: 'Jane Smith',
    genre: 'Rock',
    rate: '$200/hour',
    availability: 'Booked until October',
    imageUrl: '/assets/musicBand1.jpg',
  },
  {
    id: 3,
    musicianName: 'Mark Johnson',
    genre: 'Classical',
    rate: '$150/hour',
    availability: 'Available weekends',
    imageUrl: '/assets/musicBand1.jpg',
  },
  {
    id: 4,
    musicianName: 'Emily Davis',
    genre: 'Pop',
    rate: '$250/hour',
    availability: 'Available weekdays',
    imageUrl: '/assets/musicBand1.jpg',
  },
  {
    id: 5,
    musicianName: 'Michael Brown',
    genre: 'Blues',
    rate: '$180/hour',
    availability: 'Available for concerts',
    imageUrl: '/assets/musicBand1.jpg',
  },
];

export default function Page({ params: { lng } }: PageParams) {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto p-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
          >
            <img
              src={offer.imageUrl}
              alt={offer.musicianName}
              className="mr-6 h-24 w-24 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-semibold">
                {offer.musicianName}
              </h2>
              <p className="text-gray-600">Genre: {offer.genre}</p>
              <p className="text-gray-600">Rate: {offer.rate}</p>
              <p className="text-gray-600">
                Availability: {offer.availability}
              </p>
            </div>
            <button>
              <div className="rounded-full border border-gray-100 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-4 py-2 font-bold text-white  hover:from-[#b4c6ff] hover:to-[#b4e6ff]">
                Contact Musician
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
