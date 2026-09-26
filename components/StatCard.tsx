import { cn } from "@/lib/cn";

export default function StatCard({
  label,
  value,
  suffix,
  caption,
  accent,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  caption?: string;
  accent?: "default" | "warn";
}) {
  return (
    <div className="rounded-lg border border-forest-100 bg-paper p-4 shadow-card">
      <p className="text-[11px] font-medium tracking-[0.1em] text-ink/45">{label.toUpperCase()}</p>
      <p className={cn("mt-2 font-display text-3xl", accent === "warn" ? "text-clay" : "text-forest-700")}>
        {value}
        {suffix && <span className="ml-1 text-lg font-sans text-ink/50">{suffix}</span>}
      </p>
      {caption && <p className="mt-1 text-xs text-ink/45">{caption}</p>}
    </div>
  );
}
