import "server-only";

import { accountToken } from "@/lib/accountSession";
import { courseSlugs, findCourseBySlug } from "@/lib/courseSlug";
import { fetchCourses, type Course } from "@/lib/courses";

/** Alla kurssluggar — för generateStaticParams och sitemapen. */
export async function allCourseSlugs(): Promise<string[]> {
  return [...courseSlugs(await fetchCourses()).values()];
}

export async function courseBySlug(slug: string): Promise<Course | null> {
  return findCourseBySlug(await fetchCourses(), slug);
}

export async function viewerIsLoggedIn(): Promise<boolean> {
  return Boolean(await accountToken());
}
