import type { APIRoute } from 'astro';
import {
  getDateDaysAgoInNewYork,
  getDateDaysFromNowInNewYork,
  normalizeFootballDataMatch,
  type ScoreboardResponse,
} from '../../lib/scoreboard';

export const prerender = false;

const API_BASE = 'https://api.football-data.org/v4';
const CACHE_MS = 60 * 60_000;
const WORLD_CUP_COMPETITION = 'WC';

let cached: {
  expiresAt: number;
  payload: ScoreboardResponse;
} | null = null;

export const GET: APIRoute = async () => {
  if (cached && cached.expiresAt > Date.now()) {
    return json(cached.payload, 'public, max-age=3600, stale-while-revalidate=3600');
  }

  const token = import.meta.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return json(
      {
        generatedAt: new Date().toISOString(),
        source: 'fallback',
        message: 'Set FOOTBALL_DATA_TOKEN in your environment to enable the World Cup schedule.',
        matches: [],
      },
      'no-store',
    );
  }

  try {
    const weekAgo = getDateDaysAgoInNewYork(3);
    const weekAhead = getDateDaysFromNowInNewYork(7);
    const matches = await fetchMatches(
      token,
      `/competitions/${WORLD_CUP_COMPETITION}/matches?dateFrom=${weekAgo}&dateTo=${weekAhead}`,
    );
    const selectedMatches = matches.sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
    );

    const payload: ScoreboardResponse = {
      generatedAt: new Date().toISOString(),
      source: 'football-data',
      message:
        selectedMatches.length === 0
          ? `No World Cup matches found from ${weekAgo} to ${weekAhead}.`
          : undefined,
      matches: selectedMatches.map(normalizeFootballDataMatch),
    };

    cached = {
      expiresAt: Date.now() + CACHE_MS,
      payload,
    };

    return json(payload, 'public, max-age=3600, stale-while-revalidate=3600');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load schedule.';

    return json(
      {
        generatedAt: new Date().toISOString(),
        source: 'fallback',
        message,
        matches: [],
      },
      'no-store',
      502,
    );
  }
};

async function fetchMatches(token: string, path: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'X-Auth-Token': token,
    },
  });

  if (!response.ok) {
    throw new Error(`football-data.org request failed with ${response.status}.`);
  }

  const data = await response.json();

  return Array.isArray(data.matches) ? data.matches : [];
}

function json(payload: ScoreboardResponse, cacheControl: string, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
    },
  });
}
