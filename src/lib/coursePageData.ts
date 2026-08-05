import "server-only";

import { courseSlugs, findCourseBySlug } from "@/lib/courseSlug";
import { fetchCourses, type Course } from "@/lib/courses";

/** Alla kurssluggar — för generateStaticParams och sitemapen. */
export async function allCourseSlugs(): Promise<string[]> {
  return [...courseSlugs(await fetchCourses()).values()];
}

export async function courseBySlug(slug: string, token?: string | null): Promise<Course | null> {
  return findCourseBySlug(await fetchCourses(token), slug);
}
