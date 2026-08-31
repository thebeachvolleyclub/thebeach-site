import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  formatTrainingCourts,
  trainingGroupCourtLabel,
  trainingRecordingFeedFromWire,
} from "../src/lib/accountTrainingRecordings.core.ts";

const route = readFileSync(
  new URL("../src/app/api/account/training-recordings/route.ts", import.meta.url),
  "utf8",
);
const portal = readFileSync(
  new URL("../src/components/account/AccountPortal.tsx", import.meta.url),
  "utf8",
);
const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");

test("recording BFF uses the account identity and returns private, reduced training data", () => {
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /if \(!token\)/);
  assert.match(route, /\/training\/sessions\?include_past=true&include_recordings=true/);
  assert.match(route, /trainingRecordingFeedFromWire\(payload\)/);
  assert.match(route, /private, no-store/);
  assert.doesNotMatch(route, /playerId|userId|email|X-User-Id/);
});

test("profile preview keeps only four videos from the latest recorded week", () => {
  const feed = trainingRecordingFeedFromWire({
    sessions: [
      {
        group_name: "Borealis",
        day_time: "Måndag 18.30",
        session_date: "2026-08-17",
        court: 9,
        courts: "9, 10",
        recordings: [{ broadcast_id: "oldVideo_1", court: 9 }],
      },
      {
        group_name: "Borealis",
        day_time: "Måndag 18.30",
        session_date: "2026-08-24",
        court: 9,
        courts: "9, 10",
        recordings: [
          { broadcast_id: "newVideo_1", court_name: "Bana 9", start_time: "2026-08-24T18:30:00" },
          { broadcast_id: "newVideo_2", court_name: "Bana 10", start_time: "2026-08-24T18:31:00" },
          { broadcast_id: "newVideo_3", court: 9 },
          { broadcast_id: "newVideo_4", court: 10 },
          { broadcast_id: "newVideo_5", court: 10 },
          { broadcast_id: "newVideo_1", court_name: "duplicate" },
          { broadcast_id: "not a valid id" },
        ],
      },
    ],
  });

  assert.equal(feed.latestWeekStart, "2026-08-24");
  assert.deepEqual(feed.recent.map((recording) => recording.videoId), [
    "newVideo_1",
    "newVideo_2",
    "newVideo_3",
    "newVideo_4",
  ]);
  assert.equal(feed.recent.length, 4);
  assert.equal(feed.recent.some((recording) => recording.videoId === "oldVideo_1"), false);
  assert.equal(feed.recent[0].startTime, "18:30");
});

test("training group court labels use complete compact ranges", () => {
  const feed = trainingRecordingFeedFromWire({
    sessions: [
      { group_name: "Borealis", day_time: "Måndag 18.30", session_date: "2026-08-24", court: 9, courts: "9, 10" },
      { group_name: "Sirocco", day_time: "Tisdag 17.00", session_date: "2026-08-25", court: 6, courts: "6, 7, 8, 9, 10" },
    ],
  });

  assert.equal(trainingGroupCourtLabel(feed, "Borealis", 9), "Banor 9–10");
  assert.equal(trainingGroupCourtLabel(feed, "Sirocco", 6), "Banor 6–10");
  assert.equal(trainingGroupCourtLabel(feed, "Annan grupp", 4), "Bana 4");
  assert.equal(formatTrainingCourts("6-10", 6), "Banor 6–10");
  assert.equal(formatTrainingCourts("6, 8, 9, 10", 6), "Banor 6, 8–10");
});

test("account group section links recent thumbnails directly and delegates the long archive to BeachTV", () => {
  assert.match(portal, /Mina träningsgrupper/);
  assert.match(portal, /Senaste veckan/);
  assert.match(portal, /Hela videoarkivet/);
  assert.match(portal, /https:\/\/tv\.thebeach\.one\/mina-traningar/);
  assert.match(portal, /https:\/\/www\.youtube\.com\/watch\?v=\$\{recording\.videoId\}/);
  assert.match(portal, /https:\/\/i\.ytimg\.com\/vi\/\$\{recording\.videoId\}\/mqdefault\.jpg/);
  assert.match(portal, /overflow-x-auto/);
  assert.match(config, /hostname: "i\.ytimg\.com"/);
});
