/** MOCKUP — small fixed badge so nobody mistakes a mock route for prod. */
export default function MockBadge({ label }: { label: string }) {
  return (
    <div className="fixed bottom-4 left-4 z-[100] bg-pink px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg">
      Mockup · {label}
    </div>
  );
}
