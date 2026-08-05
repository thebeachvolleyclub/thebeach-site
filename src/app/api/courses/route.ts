import { accountToken } from "@/lib/accountSession";
import { fetchCourses } from "@/lib/courses";

export const dynamic = "force-dynamic";

/**
 * Publik kurslista. Klientsidan använder den för att uppdatera antal lediga
 * platser utan att ladda om sidan; serverrenderingen läser fetchCourses direkt.
 */
export async function GET() {
  const courses = await fetchCourses(await accountToken());
  return Response.json(
    { courses },
    { headers: { "Cache-Control": "no-store" } },
  );
}
