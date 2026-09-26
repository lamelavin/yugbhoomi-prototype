import { RiskLevel } from "@/lib/types";
import { RISK_COLORS } from "@/lib/risk";
import { cn } from "@/lib/cn";

export default function RiskBadge({
  level,
  probability,
  size = "sm",
}: {
  level: RiskLevel;
  probability?: number;
  size?: "sm" | "md";
}) {
  const c = RISK_COLORS[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ring-1",
        c.bg,
        c.text,
        c.ring,
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {level}
      {probability !== undefined && <span className="font-medium normal-case">{probability}%</span>}
    </span>
  );
}
