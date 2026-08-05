import Link from "next/link";
import RichText from "@/components/RichText";
import type { Block } from "@/lib/nyheter";

/**
 * Renderar artikelblock. Ärver RichText för länkar/e-post och lägger till
 * **fetstil** ovanpå — så att brödtext i datat kan skrivas som vanlig svenska.
 */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-black">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <RichText key={i} text={p} />
        )
      )}
    </>
  );
}

function Figure({ src, alt, caption, credit }: { src: string; alt: string; caption?: string; credit?: string }) {
  return (
    <figure className="my-10">
      <img src={src} alt={alt} loading="lazy" className="h-auto w-full rounded-lg" />
      {(caption || credit) && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-black/45">
          {caption}
          {credit && <span className="text-black/35">{caption ? " " : ""}Foto: {credit}.</span>}
        </figcaption>
      )}
    </figure>
  );
}

export default function ArticleBody({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} className="mt-12 mb-4 font-display text-[clamp(1.5rem,4.5vw,2.1rem)] uppercase leading-[1.05] text-black">
                {b.text}
              </h2>
            );

          case "p":
            return (
              <p key={i} className="mt-5 text-[17px] leading-relaxed text-black/70">
                <Inline text={b.text} />
              </p>
            );

          case "ul":
            return (
              <ul key={i} className="mt-4 space-y-2.5 border-l-2 border-lime pl-5">
                {b.items.map((item, j) => (
                  <li key={j} className="text-[16px] leading-relaxed text-black/70">
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );

          case "img":
            return <Figure key={i} {...b} />;

          case "table":
            return (
              <div key={i} className="mt-7">
                <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-[420px] border-collapse text-[15px]">
                    <thead>
                      <tr className="border-b-2 border-black">
                        {b.head.map((h, j) => (
                          <th
                            key={j}
                            scope="col"
                            className={`py-2.5 pr-4 text-[11px] font-bold uppercase tracking-[0.1em] text-black/50 ${j === 0 ? "text-left" : j >= 2 ? "text-right" : "text-left"}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, j) => (
                        <tr
                          key={j}
                          className={`border-b border-black/10 ${b.highlightFirstRow && j === 0 ? "bg-lime/25 font-semibold text-black" : "text-black/70"}`}
                        >
                          {row.map((cell, k) => (
                            <td
                              key={k}
                              className={`py-2.5 pr-4 tabular-nums ${k === 0 ? "pl-2 text-left" : k >= 2 ? "text-right" : "text-left"} ${b.highlightFirstRow && j === 0 && k === 1 ? "font-bold" : ""}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note && <p className="mt-3 text-[13px] leading-relaxed text-black/45">{b.note}</p>}
              </div>
            );

          case "callout":
            return (
              <div key={i} className="mt-8 rounded-2xl bg-mint p-6 sm:p-7">
                <h3 className="mb-2 font-display text-[clamp(1.2rem,3.5vw,1.5rem)] uppercase leading-[1.05] text-black">
                  {b.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-black/65">
                  <Inline text={b.text} />
                </p>
              </div>
            );

          case "cta": {
            const cls = b.secondary
              ? "inline-flex cursor-pointer items-center gap-2 border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime"
              : "inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85";
            const internal = b.href.startsWith("/") || b.href.startsWith("#");
            return (
              <div key={i} className="mt-6">
                {internal ? (
                  <Link href={b.href} className={cls}>
                    {b.label} <span aria-hidden="true">&rarr;</span>
                  </Link>
                ) : (
                  <a href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {b.label} <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}
