import { cn } from "@/lib/cn";

export default function ProgressBar({
  value,
  label,
  warnBelow,
}: {
  value: number;
  label?: string;
  warnBelow?: number;
}) {
  const warn = warnBelow !== undefined && value < warnBelow;
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-ink/55">{label}</span>
          <span className={cn("font-medium", warn ? "text-clay" : "text-forest-700")}>{value}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-forest-50">
        <div
          className={cn("h-2 rounded-full", warn ? "bg-clay" : "bg-forest-600")}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
