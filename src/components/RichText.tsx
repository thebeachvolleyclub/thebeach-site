import Link from "next/link";

/**
 * Renderar text med inline-länkar i markdown-stil: [etikett](url).
 * Interna länkar (/ eller #) → next/link. Externa (http) → ny flik.
 * Gör att kalendertexter kan få klickbara länkar utan HTML i datat.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const linkCls =
  "font-semibold text-black underline underline-offset-4 transition-colors hover:text-black/60";

export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    const internal = href.startsWith("/") || href.startsWith("#");
    parts.push(
      internal ? (
        <Link key={key++} href={href} className={linkCls}>
          {label}
        </Link>
      ) : (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkCls}
        >
          {label}
        </a>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
