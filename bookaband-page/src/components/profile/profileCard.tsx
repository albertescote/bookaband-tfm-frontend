import React from 'react';

interface EventSummary {
  id: string;
  title: string;
  date: string;
}

interface Musician {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Rating {
  id: string;
  musicianName: string;
  comment: string;
  score: number;
}

interface ClientProfileProps {
  fullName: string;
  email?: string;
  imageUrl?: string;
  bio?: string;
  location?: string;
  joinedDate: string;

  genres?: string[];
  eventPreferences?: string[];
  averageBudget?: number;
  eventFrequency?: 'occasional' | 'monthly' | 'quarterly';

  musiciansContacted: number;
  eventsOrganized: number;
  upcomingEvents: EventSummary[];
  favoriteMusicians: Musician[];
  ratingsGiven: Rating[];
}

const ClientProfile: React.FC<ClientProfileProps> = ({
  fullName,
  email,
  imageUrl,
  bio,
  location,
  joinedDate,
  genres = [],
  eventPreferences = [],
  averageBudget,
  eventFrequency,
  musiciansContacted,
  eventsOrganized,
  upcomingEvents,
  favoriteMusicians,
  ratingsGiven,
}) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={fullName}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
            {fullName.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{fullName}</h2>
          {bio && <p className="text-sm text-gray-600">{bio}</p>}
          {location && <p className="text-sm text-gray-500">📍 {location}</p>}
          <p className="text-sm text-gray-400">Joined: {joinedDate}</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Preferences</h3>
          <p>
            <strong>Genres:</strong> {genres.join(', ') || '—'}
          </p>
          <p>
            <strong>Event Types:</strong> {eventPreferences.join(', ') || '—'}
          </p>
          <p>
            <strong>Average Budget:</strong>{' '}
            {averageBudget ? `€${averageBudget}` : '—'}
          </p>
          <p>
            <strong>Event Frequency:</strong> {eventFrequency || '—'}
          </p>
        </div>

        {/* Activity Overview */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Activity Overview</h3>
          <p>
            <strong>Musicians Contacted:</strong> {musiciansContacted}
          </p>
          <p>
            <strong>Events Organized:</strong> {eventsOrganized}
          </p>
          <div>
            <strong>Upcoming Events:</strong>
            <ul className="ml-5 list-disc text-sm">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <li key={event.id}>
                    {event.title} — {event.date}
                  </li>
                ))
              ) : (
                <li>No upcoming events</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Favorite Musicians */}
      <div>
        <h3 className="mb-2 text-lg font-semibold">Favorite Musicians</h3>
        <div className="flex flex-wrap gap-4">
          {favoriteMusicians.length > 0 ? (
            favoriteMusicians.map((musician) => (
              <div
                key={musician.id}
                className="flex items-center space-x-2 rounded-lg bg-gray-100 p-2"
              >
                {musician.imageUrl ? (
                  <img
                    src={musician.imageUrl}
                    alt={musician.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-xs text-white">
                    {musician.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm">{musician.name}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No favorites yet</p>
          )}
        </div>
      </div>

      {/* Ratings Given */}
      <div>
        <h3 className="mb-2 text-lg font-semibold">Ratings Given</h3>
        {ratingsGiven.length > 0 ? (
          <ul className="space-y-3">
            {ratingsGiven.map((rating) => (
              <li
                key={rating.id}
                className="rounded-lg border bg-white p-3 shadow-sm"
              >
                <p className="font-medium">{rating.musicianName}</p>
                <p className="text-sm text-gray-600">
                  ⭐ {rating.score}/5 — {rating.comment}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No ratings given yet</p>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
