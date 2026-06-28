export type ScoreboardTeam = {
  name: string;
  logo?: string | null;
  score: number | null;
};

export type ScoreboardMatch = {
  id: number;
  status: string;
  statusShort: string;
  elapsed: number | null;
  leagueId: number;
  league: string;
  country: string;
  kickoff: string;
  venue: string | null;
  home: ScoreboardTeam;
  away: ScoreboardTeam;
};

export type ScoreboardResponse = {
  generatedAt: string;
  source: 'football-data' | 'fallback';
  message?: string;
  matches: ScoreboardMatch[];
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  competition: {
    id: number;
    name: string;
    area?: {
      name?: string;
    };
  };
  homeTeam: {
    name?: string | null;
    crest?: string | null;
  } | null;
  awayTeam: {
    name?: string | null;
    crest?: string | null;
  } | null;
  score: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
  venue?: string | null;
};

const statusMap: Record<string, string> = {
  TIMED: 'Scheduled',
  SCHEDULED: 'Scheduled',
  IN_PLAY: 'In play',
  PAUSED: 'Halftime',
  FINISHED: 'Full Time',
  POSTPONED: 'Postponed',
  SUSPENDED: 'Suspended',
  CANCELED: 'Canceled',
  CANCELLED: 'Canceled',
};

const statusShortMap: Record<string, string> = {
  TIMED: 'NS',
  SCHEDULED: 'NS',
  IN_PLAY: 'LIVE',
  PAUSED: 'HT',
  FINISHED: 'FT',
  POSTPONED: 'PST',
  SUSPENDED: 'SUSP',
  CANCELED: 'CANC',
  CANCELLED: 'CANC',
};

export function normalizeFootballDataMatch(match: FootballDataMatch): ScoreboardMatch {
  const score = match.score.fullTime ?? match.score.halfTime;

  return {
    id: match.id,
    status: statusMap[match.status] ?? match.status,
    statusShort: statusShortMap[match.status] ?? match.status,
    elapsed: null,
    leagueId: match.competition.id,
    league: match.competition.name,
    country: match.competition.area?.name ?? '',
    kickoff: match.utcDate,
    venue: match.venue ?? null,
    home: {
      name: getTeamName(match.homeTeam),
      logo: match.homeTeam?.crest,
      score: score?.home ?? null,
    },
    away: {
      name: getTeamName(match.awayTeam),
      logo: match.awayTeam?.crest,
      score: score?.away ?? null,
    },
  };
}

function getTeamName(team: FootballDataMatch['homeTeam']) {
  return team?.name || 'TBD';
}

export function getTodayInNewYork() {
  return formatDateInNewYork(new Date());
}

export function getDateDaysAgoInNewYork(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDateInNewYork(date);
}

export function getDateDaysFromNowInNewYork(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDateInNewYork(date);
}

function formatDateInNewYork(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
