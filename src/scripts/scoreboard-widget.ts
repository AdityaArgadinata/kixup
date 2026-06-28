type DisplayMode = 'scores' | 'schedule';

type ScoreboardTeam = {
  name: string;
  logo?: string | null;
  score: number | null;
};

type ScoreboardMatch = {
  status: string;
  statusShort: string;
  elapsed: number | null;
  league: string;
  kickoff: string;
  home: ScoreboardTeam;
  away: ScoreboardTeam;
};

type ScoreboardResponse = {
  generatedAt?: string;
  message?: string;
  matches?: ScoreboardMatch[];
};

const statusLabels = new Map<string, string>([
  ['NS', 'Scheduled'],
  ['LIVE', 'In play'],
  ['1H', 'First half'],
  ['HT', 'Halftime'],
  ['2H', 'Second half'],
  ['ET', 'Extra time'],
  ['P', 'Penalties'],
  ['FT', 'Full Time'],
  ['AET', 'After Extra Time'],
  ['PEN', 'After Penalties'],
  ['PST', 'Postponed'],
  ['SUSP', 'Suspended'],
  ['CANC', 'Canceled'],
]);

document.querySelectorAll('[data-scoreboard]').forEach((root) => {
  const endpoint = root.getAttribute('data-endpoint') ?? '/api/scoreboard.json';
  const limit = Number(root.getAttribute('data-limit')) || undefined;
  const emptyMessage = root.getAttribute('data-empty-message') || 'No matches are available for the selected window.';
  const display: DisplayMode = root.getAttribute('data-display') === 'schedule' ? 'schedule' : 'scores';
  const isCompact = root.getAttribute('data-compact') === 'true';
  const body = root.querySelector('[data-scoreboard-body]');
  const meta = root.querySelector('[data-scoreboard-meta]');

  async function loadScoreboard() {
    if (!body || !meta) return;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
        },
      });
      const data = (await response.json()) as ScoreboardResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load scores.');
      }

      const allMatches = Array.isArray(data.matches) ? data.matches : [];
      const matches = limit ? allMatches.slice(0, limit) : allMatches;
      body.innerHTML = renderMatches(matches, data.message, emptyMessage, display, isCompact);
      meta.textContent = data.generatedAt
        ? `Updated ${new Date(data.generatedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short',
          })}.`
        : 'Updated recently.';
    } catch (error) {
      body.innerHTML = renderEmpty(error instanceof Error ? error.message : 'Unable to load scores.');
      meta.textContent = 'Scoreboard unavailable right now.';
    }
  }

  loadScoreboard();
});

function renderMatches(
  matches: ScoreboardMatch[],
  message: string | undefined,
  emptyMessage: string,
  display: DisplayMode,
  isCompact: boolean,
) {
  if (matches.length === 0) {
    return renderEmpty(message || emptyMessage);
  }

  const gridClass = isCompact ? 'grid gap-2' : 'grid gap-3 md:grid-cols-2';

  return `<div class="${gridClass}">${matches.map((match) => renderMatch(match, display, isCompact)).join('')}</div>`;
}

function renderMatch(match: ScoreboardMatch, display: DisplayMode, isCompact: boolean) {
  const status = statusLabels.get(match.statusShort) || match.status || match.statusShort;
  const kickoff = new Date(match.kickoff);
  const dateLabel = kickoff.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const timeLabel = kickoff.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short',
  });
  const matchTime = match.statusShort === 'NS'
    ? `${dateLabel} · ${timeLabel}`
    : `${status}${match.elapsed ? ` · ${match.elapsed}'` : ''}`;

  if (display === 'schedule') {
    return `
      <article class="border border-slate-200 bg-slate-50 p-4">
        <div class="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          <span>${escapeHtml(match.league)}</span>
          <span>${escapeHtml(status)}</span>
        </div>
        <p class="mt-3 text-sm font-black text-slate-950">${escapeHtml(dateLabel)}</p>
        <p class="mt-1 text-sm font-semibold text-slate-600">${escapeHtml(timeLabel)}</p>
        <div class="mt-4 flex items-center justify-between gap-3">
          ${renderScheduleTeam(match.home)}
          <span class="shrink-0 text-xs font-black uppercase text-slate-400">vs</span>
          ${renderScheduleTeam(match.away)}
        </div>
      </article>
    `;
  }

  return `
    <article class="border border-slate-200 bg-slate-50 ${isCompact ? 'p-3' : 'p-4'}">
      <div class="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        <span class="truncate">${escapeHtml(match.league)}</span>
        <span class="shrink-0 whitespace-nowrap">${escapeHtml(matchTime)}</span>
      </div>
      <div class="${isCompact ? 'mt-3 space-y-2' : 'mt-4 space-y-3'}">
        ${renderTeam(match.home, isCompact)}
        ${renderTeam(match.away, isCompact)}
      </div>
    </article>
  `;
}

function renderScheduleTeam(team: ScoreboardTeam) {
  const teamName = team?.name || 'TBD';

  return `
    <div class="flex min-w-0 flex-1 items-center gap-2">
      ${team?.logo ? `<img src="${escapeHtml(team.logo)}" alt="" loading="lazy" decoding="async" class="h-6 w-6 shrink-0 object-contain" />` : ''}
      <span class="truncate text-sm font-bold text-slate-950">${escapeHtml(teamName)}</span>
    </div>
  `;
}

function renderTeam(team: ScoreboardTeam, isCompact = false) {
  const teamName = team?.name || 'TBD';
  const score = team.score === null || team.score === undefined ? '-' : team.score;

  return `
    <div class="flex items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-3">
        ${team?.logo ? `<img src="${escapeHtml(team.logo)}" alt="" loading="lazy" decoding="async" class="${isCompact ? 'h-5 w-5' : 'h-6 w-6'} shrink-0 object-contain" />` : ''}
        <span class="truncate ${isCompact ? 'text-xs' : 'text-sm'} font-bold text-slate-950">${escapeHtml(teamName)}</span>
      </div>
      <span class="${isCompact ? 'text-base' : 'text-lg'} font-black tabular-nums text-emerald-700">${score}</span>
    </div>
  `;
}

function renderEmpty(message: string) {
  return `
    <div class="border border-dashed border-slate-300 bg-slate-50 p-5">
      <p class="text-sm font-bold text-slate-950">Latest scores are ready.</p>
      <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(message)}</p>
    </div>
  `;
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
