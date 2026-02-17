export type Concert = {
  id: string;

  // Dados iniciais
  date: Date;
  artist: string;
  venue: string;
  city: string;

  // Dados do Organize Memory
  tour: string | null;
  support: string | null;
  songMissed: string | null;
  bestLiveSong: string | null;
  description: string | null;
  kmTraveled: number | null;

  // Ratings
  entranceRating: number | null;
  supportActRating: number | null;
  mainActRating: number | null;
  crowdRating: number | null;
  stageShowRating: number | null;
  moodRating: number | null;
  overallRating: number | null;
  setlistRating: number | null;
  energyAfter: number | null;

  experienceTags: string[];

  ticketImageUrl: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type ConcertSummary = Pick<
  Concert,
  | 'id'
  | 'artist'
  | 'venue'
  | 'city'
  | 'date'
  | 'setlistRating'
  | 'kmTraveled'
  | 'createdAt'
  | 'updatedAt'
>;

export type ConcertInitialData = Pick<
  Concert,
  'date' | 'artist' | 'venue' | 'city' | 'description'
>;

export type ConcertAISuggestions = Omit<
  Concert,
  | 'id'
  | 'date'
  | 'artist'
  | 'venue'
  | 'city'
  | 'ticketImageUrl'
  | 'createdAt'
  | 'updatedAt'
>;
