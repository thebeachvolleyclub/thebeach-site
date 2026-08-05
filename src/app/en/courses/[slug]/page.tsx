import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CourseDetail from "@/components/kurser/CourseDetail";
import { accountToken } from "@/lib/accountSession";
import { allCourseSlugs, courseBySlug } from "@/lib/coursePageData";
import { courseSummary } from "@/lib/courseMeta";
import { og } from "@/lib/seo";

// Samma slug som svenska sidan — en delad länk pekar alltid på samma kurs.
export const revalidate = 900;

export async function generateStaticParams() {
  return (await allCourseSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  if (!course) return {};
  const { title, description } = courseSummary(course, "en");
  return {
    title: `${title} | The Beach`,
    description,
    alternates: {
      canonical: `/en/courses/${slug}`,
      languages: { sv: `/kurser/${slug}`, en: `/en/courses/${slug}` },
    },
    openGraph: og(`/en/courses/${slug}`, title, description, {
      type: "article",
      locale: "en_US",
    }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await accountToken();
  const course = await courseBySlug(slug, token);
  if (!course) notFound();
  return (
    <CourseDetail
      course={course}
      locale="en"
      loggedIn={Boolean(token)}
      path={`/en/courses/${slug}`}
    />
  );
}
