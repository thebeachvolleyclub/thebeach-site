import Link from "next/link";

/**
 * Renderar text med klickbara länkar:
 *  - markdown-stil [etikett](url)  → intern (/ eller #) = next/link, annars ny flik
 *  - bara e-post (namn@domän)      → mailto:
 *  - bara URL (https://… / www.…)  → ny flik
 * Gör att brödtext i datat kan bli klickbar utan HTML.
 */
const TOKEN =
  /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)|(\bwww\.[^\s)]+)|([\w.+-]+@[\w-]+\.[\w.-]*[\w-])/g;
const linkCls =
  "font-semibold text-black underline underline-offset-4 transition-colors hover:text-black/60";

function ext(href: string, label: string, key: number) {
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {label}
    </a>
  );
}

export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [full, mdLabel, mdHref, httpUrl, wwwUrl, email] = m;
    if (mdLabel) {
      const internal = mdHref.startsWith("/") || mdHref.startsWith("#");
      parts.push(
        internal ? (
          <Link key={key++} href={mdHref} className={linkCls}>
            {mdLabel}
          </Link>
        ) : (
          ext(mdHref, mdLabel, key++)
        )
      );
    } else if (httpUrl || wwwUrl) {
      const raw = (httpUrl || wwwUrl) as string;
      const trimmed = raw.replace(/[.,;:!?]+$/, "");
      const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      parts.push(ext(href, trimmed, key++));
      if (trimmed.length < raw.length) parts.push(raw.slice(trimmed.length));
    } else if (email) {
      parts.push(ext(`mailto:${email}`, email, key++));
    }
    last = m.index + full.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
