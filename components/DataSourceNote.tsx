import { DataSource } from "@/lib/types";

export default function DataSourceNote({ source, note }: { source: DataSource; note?: string }) {
  if (source === "live") {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="font-medium">Live monitoring API</span>
        {note && <span className="text-ink/40">\u00b7 {note}</span>}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="rounded bg-gold/15 px-1.5 py-0.5 font-semibold tracking-wide text-gold">SYNTHETIC DATA</span>
      <span className="text-ink/45">
        {note || "Backend unreachable \u2014 showing the bundled demo dataset, not live figures."}
      </span>
    </div>
  );
}
