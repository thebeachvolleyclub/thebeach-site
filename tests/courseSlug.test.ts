import assert from "node:assert/strict";
import test from "node:test";

import {
  coursePath,
  courseSlugs,
  findCourseBySlug,
  slugify,
} from "../src/lib/courseSlug.ts";

type TestCourse = Parameters<typeof courseSlugs>[0][number];

function course(over: Partial<TestCourse> & { id: number }): TestCourse {
  return {
    id: over.id,
    name: over.name ?? "Grundkurs beachvolley – tisdagar 19:00 (höst 2026)",
    level: over.level ?? "Grundkurs",
    description: null,
    prerequisites: null,
    termsMarkdown: null,
    termsVersion: "2026-2",
    season: null,
    schedule: over.schedule ?? { dayOfWeek: 2, startTime: "19:00" },
    coaches: [],
    capacity: 16,
    remainingPlaces: 16,
    waitlistCount: 0,
    priceSek: 795,
    registrationOpensAt: null,
    registrationClosesAt: null,
    sessions: [],
  } as TestCourse;
}

test("slugify strips Swedish characters without losing words", () => {
  assert.equal(slugify("Fortsättning"), "fortsattning");
  assert.equal(slugify("Grundkurs beachvolley – tisdagar 19:00"), "grundkurs-beachvolley-tisdagar-19-00");
  assert.equal(slugify("  Höst  2026 "), "host-2026");
});

test("the slug reads the way a customer talks about the course", () => {
  const courses = [
    course({ id: 156, level: "Grundkurs", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
    course({ id: 158, level: "Grundkurs", schedule: { dayOfWeek: 4, startTime: "20:30" } }),
    course({ id: 157, level: "Fortsättning", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
  ];
  const slugs = courseSlugs(courses);
  assert.equal(slugs.get(156), "grundkurs-tisdag-1900");
  assert.equal(slugs.get(158), "grundkurs-torsdag-2030");
  assert.equal(slugs.get(157), "fortsattningskurs-tisdag-1900");
});

test("a collision leaves the oldest course's link untouched", () => {
  const courses = [
    course({ id: 300, level: "Grundkurs", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
    course({ id: 156, level: "Grundkurs", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
  ];
  const slugs = courseSlugs(courses);
  assert.equal(slugs.get(156), "grundkurs-tisdag-1900", "redan delad länk får inte byta adress");
  assert.equal(slugs.get(300), "grundkurs-tisdag-1900-300");
});

test("a course without a schedule still gets a usable slug", () => {
  const courses = [course({ id: 42, name: "Prova på beachvolley", level: "", schedule: null })];
  assert.equal(courseSlugs(courses).get(42), "prova-pa-beachvolley");
});

test("lookup resolves both plain and suffixed slugs, and rejects unknown ones", () => {
  const courses = [
    course({ id: 156, level: "Grundkurs", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
    course({ id: 300, level: "Grundkurs", schedule: { dayOfWeek: 2, startTime: "19:00" } }),
  ];
  assert.equal(findCourseBySlug(courses, "grundkurs-tisdag-1900")?.id, 156);
  assert.equal(findCourseBySlug(courses, "grundkurs-tisdag-1900-300")?.id, 300);
  assert.equal(findCourseBySlug(courses, "GRUNDKURS-TISDAG-1900")?.id, 156);
  assert.equal(findCourseBySlug(courses, "finns-inte"), null);
});

test("the same slug serves both languages", () => {
  assert.equal(coursePath("grundkurs-tisdag-1900", "sv"), "/kurser/grundkurs-tisdag-1900");
  assert.equal(coursePath("grundkurs-tisdag-1900", "en"), "/en/courses/grundkurs-tisdag-1900");
});
