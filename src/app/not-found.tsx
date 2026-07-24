import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Brandad 404 — hitta din väg tillbaka till sanden. */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-black px-5 pb-24 pt-40 sm:px-8 lg:px-14 lg:pt-48">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime">404</p>
          <h1 className="mb-5 font-display text-[clamp(2.5rem,10vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white">
            Den här sidan{" "}<br /><span className="italic-accent">blåste bort</span>
          </h1>
          <p className="mx-auto mb-3 max-w-md text-sm leading-relaxed text-white/50">
            Sidan du letar efter finns inte — men sanden ligger kvar där den ska.
            Hitta din väg tillbaka:
          </p>
          <p className="mx-auto mb-9 max-w-md text-xs leading-relaxed text-white/30">
            This page could not be found — but the sand is right where it should be.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">
              Till startsidan
            </Link>
            <Link href="/boka" className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
              Boka bana
            </Link>
            <Link href="/events" className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
              Boka event
            </Link>
            <Link href="/kalender" className="cursor-pointer border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/50">
              Kalendern
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
