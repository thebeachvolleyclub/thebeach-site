import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CourseDetail from "@/components/kurser/CourseDetail";
import { accountToken } from "@/lib/accountSession";
import { allCourseSlugs, courseBySlug } from "@/lib/coursePageData";
import { courseSummary } from "@/lib/courseMeta";
import { og } from "@/lib/seo";

// Platser och anmälningsläge ändras — håll sidan färsk men inte dyr.
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
  const { title, description } = courseSummary(course, "sv");
  return {
    title: `${title} | The Beach`,
    description,
    alternates: {
      canonical: `/kurser/${slug}`,
      languages: { sv: `/kurser/${slug}`, en: `/en/courses/${slug}` },
    },
    openGraph: og(`/kurser/${slug}`, title, description, { type: "article" }),
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
      locale="sv"
      loggedIn={Boolean(token)}
      path={`/kurser/${slug}`}
    />
  );
}
