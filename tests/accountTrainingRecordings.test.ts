import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  formatTrainingCourts,
  trainingGroupCourtLabel,
  trainingGroupRecentRecordings,
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

test("each profile group keeps its own four videos from its latest recorded week", () => {
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
      {
        group_name: "Sirocco",
        day_time: "Tisdag 17.00",
        session_date: "2026-08-18",
        court: 6,
        courts: "6, 7, 8, 9, 10",
        recordings: [{ broadcast_id: "siroccoOld1", court: 6 }],
      },
      {
        group_name: "Sirocco",
        day_time: "Tisdag 17.00",
        session_date: "2026-08-31",
        court: 6,
        courts: "6, 7, 8, 9, 10",
        recordings: [
          { broadcast_id: "siroccoNew2", court: 10 },
          { broadcast_id: "siroccoNew1", court: 6 },
        ],
      },
    ],
  });

  const borealis = trainingGroupRecentRecordings(feed, "Borealis", "Måndag 18.30", 9);
  const sirocco = trainingGroupRecentRecordings(feed, "Sirocco", "Tisdag 17.00", 6);
  assert.equal(feed.groups.find((group) => group.groupName === "Borealis")?.latestWeekStart, "2026-08-24");
  assert.equal(feed.groups.find((group) => group.groupName === "Sirocco")?.latestWeekStart, "2026-08-31");
  assert.deepEqual(borealis.map((recording) => recording.videoId), [
    "newVideo_1",
    "newVideo_3",
    "newVideo_2",
    "newVideo_4",
  ]);
  assert.equal(borealis.length, 4);
  assert.equal(borealis.some((recording) => recording.videoId === "oldVideo_1"), false);
  assert.equal(borealis[0].startTime, "18:30");
  assert.deepEqual(borealis.map((recording) => recording.court), ["Bana 9", "Bana 9", "Bana 10", "Bana 10"]);
  assert.deepEqual(sirocco.map((recording) => recording.videoId), ["siroccoNew1", "siroccoNew2"]);
  assert.deepEqual(sirocco.map((recording) => recording.court), ["Bana 6", "Bana 10"]);
  assert.equal(sirocco.some((recording) => recording.videoId === "siroccoOld1"), false);
});

test("training group court labels use complete compact ranges", () => {
  const feed = trainingRecordingFeedFromWire({
    sessions: [
      { group_name: "Borealis", day_time: "Måndag 18.30", session_date: "2026-08-24", court: 9, courts: "9, 10" },
      { group_name: "Sirocco", day_time: "Tisdag 17.00", session_date: "2026-08-25", court: 6, courts: "6, 7, 8, 9, 10" },
    ],
  });

  assert.equal(trainingGroupCourtLabel(feed, "Borealis", "Måndag 18.30", 9), "Banor 9–10");
  assert.equal(trainingGroupCourtLabel(feed, "Sirocco", "Tisdag 17.00", 6), "Banor 6–10");
  assert.equal(trainingGroupCourtLabel(feed, "Äldre visningsnamn", "Måndag 18.30", 9), "Banor 9–10");
  assert.equal(trainingGroupCourtLabel(feed, "Annan grupp", "Onsdag 19.00", 4), "Bana 4");
  assert.equal(formatTrainingCourts("6-10", 6), "Banor 6–10");
  assert.equal(formatTrainingCourts("6, 8, 9, 10", 6), "Banor 6, 8–10");
});

test("account nests small recording strips per group and keeps one archive link after the list", () => {
  assert.match(portal, /Mina träningsgrupper/);
  assert.match(portal, /trainingGroupRecentRecordings\(trainingRecordings, group\.group_name, group\.day_time, group\.court\)/);
  assert.match(portal, /<TrainingGroupRecordingStrip recordings=\{recordings\} groupName=\{group\.group_name\} \/>/);
  assert.match(portal, /Senaste filmerna/);
  assert.match(portal, /Hela videoarkivet/);
  assert.equal(portal.match(/Hela videoarkivet/g)?.length, 1);
  assert.match(portal, /https:\/\/tv\.thebeach\.one\/mina-traningar/);
  assert.match(portal, /https:\/\/www\.youtube\.com\/watch\?v=\$\{recording\.videoId\}/);
  assert.match(portal, /https:\/\/i\.ytimg\.com\/vi\/\$\{recording\.videoId\}\/mqdefault\.jpg/);
  assert.match(portal, /overflow-x-auto/);
  assert.match(portal, /w-24 shrink-0/);
  assert.match(portal, /recording\.court \? \(/);
  assert.match(portal, /absolute bottom-1 left-1 bg-black\/85/);
  assert.match(portal, /\{recording\.court\}/);
  assert.doesNotMatch(portal, /TrainingRecordingShelf|w-44 shrink-0/);
  assert.match(config, /hostname: "i\.ytimg\.com"/);
});
