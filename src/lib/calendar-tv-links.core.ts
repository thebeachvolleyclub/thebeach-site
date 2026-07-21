type InvitationSource = {
  date: string;
  ibId: string;
};

type CalendarEvent = {
  day: string;
  type: string;
  tvCta?: { label: string; href: string };
};

type CalendarMonth = {
  month: string;
  events: CalendarEvent[];
};

const MONTH_NAMES = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];

function renderedManualTournament(
  months: CalendarMonth[],
  source: InvitationSource,
): CalendarEvent | undefined {
  const date = new Date(source.date + "T12:00:00");
  const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  return months
    .find((month) => month.month.toLowerCase() === label.toLowerCase())
    ?.events.find(
      (event) => event.day === String(date.getDate()) && event.type === "tournament",
    );
}

export function snapshotInvitationsForRenderedManualRows<T extends InvitationSource>(
  months: CalendarMonth[],
  snapshot: T[],
): T[] {
  return snapshot.filter(
    (source) => Boolean(source.ibId.trim()) && Boolean(renderedManualTournament(months, source)),
  );
}

export function attachBeachTvLinksToRenderedManualRows(
  months: CalendarMonth[],
  sources: InvitationSource[],
  hrefByInvitationId: Map<string, string>,
): void {
  for (const source of sources) {
    const href = hrefByInvitationId.get(source.ibId.trim());
    const event = renderedManualTournament(months, source);
    if (href && event) {
      event.tvCta = { label: "Se tävlingen på BeachTV", href };
    }
  }
}
