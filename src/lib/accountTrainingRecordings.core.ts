export type TrainingRecordingPreview = {
  videoId: string;
  groupName: string;
  sessionDate: string;
  court: string;
  startTime: string;
};

export type TrainingGroupCourts = {
  groupName: string;
  dayTime: string;
  courts: string | null;
  court: number | null;
};

export type TrainingRecordingFeed = {
  latestWeekStart: string | null;
  recent: TrainingRecordingPreview[];
  groupCourts: TrainingGroupCourts[];
};

export const EMPTY_TRAINING_RECORDING_FEED: TrainingRecordingFeed = {
  latestWeekStart: null,
  recent: [],
  groupCourts: [],
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,32}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PROFILE_RECORDINGS = 4;

function objectValue(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function shortText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeDate(value: unknown): string {
  const candidate = shortText(value, 10);
  if (!ISO_DATE.test(candidate)) return "";
  const parsed = new Date(`${candidate}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== candidate
    ? ""
    : candidate;
}

function weekStart(value: string): string {
  const day = new Date(`${value}T00:00:00Z`);
  const weekday = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() - weekday + 1);
  return day.toISOString().slice(0, 10);
}

function numericCourt(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value < 100
    ? value
    : null;
}

function courtText(recording: Record<string, unknown>, session: Record<string, unknown>): string {
  const named = shortText(recording.court_name, 40);
  if (named) return named;
  const recordingCourt = numericCourt(recording.court);
  if (recordingCourt) return `Bana ${recordingCourt}`;
  const courts = shortText(session.courts, 40);
  if (courts) return formatTrainingCourts(courts, numericCourt(session.court));
  const sessionCourt = numericCourt(session.court);
  return sessionCourt ? `Bana ${sessionCourt}` : "";
}

function timeText(value: unknown): string {
  const candidate = shortText(value, 64);
  if (!candidate) return "";
  const match = candidate.match(/(?:T|\s)(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "";
}

function expandedCourts(value: string): number[] | null {
  const courts = new Set<number>();
  for (const rawPart of value.split(/[,;]/)) {
    const part = rawPart.trim();
    const single = part.match(/^\d{1,2}$/);
    if (single) {
      courts.add(Number(single[0]));
      continue;
    }
    const range = part.match(/^(\d{1,2})\s*[-–—]\s*(\d{1,2})$/);
    if (!range) return null;
    const start = Number(range[1]);
    const end = Number(range[2]);
    if (start < 1 || end < start || end - start > 20) return null;
    for (let court = start; court <= end; court += 1) courts.add(court);
  }
  return courts.size ? [...courts].filter((court) => court > 0 && court < 100).sort((a, b) => a - b) : null;
}

function compressedCourtNumbers(courts: number[]): string {
  const chunks: string[] = [];
  let start = courts[0];
  let end = courts[0];
  for (const court of courts.slice(1)) {
    if (court === end + 1) {
      end = court;
      continue;
    }
    chunks.push(start === end ? String(start) : `${start}–${end}`);
    start = court;
    end = court;
  }
  chunks.push(start === end ? String(start) : `${start}–${end}`);
  return chunks.join(", ");
}

export function formatTrainingCourts(courts: string | null | undefined, fallbackCourt: number | null): string {
  const value = shortText(courts, 40);
  const parsed = value ? expandedCourts(value) : null;
  if (parsed?.length) {
    return `${parsed.length === 1 ? "Bana" : "Banor"} ${compressedCourtNumbers(parsed)}`;
  }
  if (value) return `Banor ${value}`;
  return fallbackCourt ? `Bana ${fallbackCourt}` : "";
}

export function trainingGroupCourtLabel(
  feed: TrainingRecordingFeed,
  groupName: string,
  fallbackCourt: number | null,
): string {
  const normalized = groupName.trim().toLocaleLowerCase("sv-SE");
  const group = feed.groupCourts.find((candidate) => (
    candidate.groupName.trim().toLocaleLowerCase("sv-SE") === normalized
  ));
  return formatTrainingCourts(group?.courts, group?.court ?? fallbackCourt);
}

export function trainingRecordingFeedFromWire(payload: unknown): TrainingRecordingFeed {
  const body = objectValue(payload);
  const sessions = Array.isArray(body?.sessions) ? body.sessions : [];
  const candidates: Array<TrainingRecordingPreview & { week: string }> = [];
  const groups = new Map<string, TrainingGroupCourts & { sessionDate: string }>();

  for (const item of sessions) {
    const session = objectValue(item);
    if (!session) continue;
    const groupName = shortText(session.group_name, 120);
    const dayTime = shortText(session.day_time, 80);
    const sessionDate = safeDate(session.session_date);
    if (!groupName || !sessionDate) continue;

    const existingGroup = groups.get(groupName);
    if (!existingGroup || sessionDate >= existingGroup.sessionDate) {
      groups.set(groupName, {
        groupName,
        dayTime,
        courts: shortText(session.courts, 40) || null,
        court: numericCourt(session.court),
        sessionDate,
      });
    }

    if (!Array.isArray(session.recordings)) continue;
    for (const itemRecording of session.recordings) {
      const recording = objectValue(itemRecording);
      if (!recording) continue;
      const videoId = shortText(recording.broadcast_id, 32);
      if (!YOUTUBE_ID.test(videoId)) continue;
      candidates.push({
        videoId,
        groupName,
        sessionDate,
        court: courtText(recording, session),
        startTime: timeText(recording.start_time),
        week: weekStart(sessionDate),
      });
    }
  }

  const latestWeekStart = candidates.reduce<string | null>(
    (latest, recording) => !latest || recording.week > latest ? recording.week : latest,
    null,
  );
  const seenRecent = new Set<string>();
  const recent = candidates
    .filter((recording) => recording.week === latestWeekStart)
    .sort((a, b) => (
      b.sessionDate.localeCompare(a.sessionDate)
      || (a.startTime || "99:99").localeCompare(b.startTime || "99:99")
    ))
    .filter((recording) => {
      if (seenRecent.has(recording.videoId)) return false;
      seenRecent.add(recording.videoId);
      return true;
    })
    .slice(0, MAX_PROFILE_RECORDINGS)
    .map((recording) => ({
      videoId: recording.videoId,
      groupName: recording.groupName,
      sessionDate: recording.sessionDate,
      court: recording.court,
      startTime: recording.startTime,
    }));

  return {
    latestWeekStart,
    recent,
    groupCourts: [...groups.values()].map((group) => ({
      groupName: group.groupName,
      dayTime: group.dayTime,
      courts: group.courts,
      court: group.court,
    })),
  };
}
