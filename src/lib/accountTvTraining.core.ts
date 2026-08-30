type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function nullableScalar(value: unknown): string | number | null {
  return typeof value === "string" || typeof value === "number" ? value : null;
}

/** Keep the TV handoff intentionally smaller than the app calendar payload. */
export function projectTvTrainingSessions(payload: unknown) {
  const sessions = record(payload).sessions;
  if (!Array.isArray(sessions)) return [];
  return sessions.map((rawSession) => {
    const session = record(rawSession);
    const recordings = Array.isArray(session.recordings) ? session.recordings : [];
    return {
      group_name: typeof session.group_name === "string" ? session.group_name : "",
      session_date: typeof session.session_date === "string" ? session.session_date : "",
      court: nullableScalar(session.court),
      courts: typeof session.courts === "string" ? session.courts : null,
      recordings: recordings.map((rawRecording) => {
        const recording = record(rawRecording);
        return {
          broadcast_id: typeof recording.broadcast_id === "string" ? recording.broadcast_id : "",
          court: nullableScalar(recording.court),
          court_name: typeof recording.court_name === "string" ? recording.court_name : null,
          start_time: typeof recording.start_time === "string" ? recording.start_time : null,
        };
      }),
    };
  });
}
