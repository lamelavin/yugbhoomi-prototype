import { Project } from "@/lib/types";
import { STAGE_SEQUENCE, STAGES } from "@/lib/stages";
import { cn } from "@/lib/cn";

export default function StageTimeline({ project }: { project: Project }) {
  const currentIdx = STAGE_SEQUENCE.indexOf(project.currentStage);
  const history = new Map(project.stageHistory.map((h) => [h.stage, h]));

  return (
    <div>
      <div className="flex items-center">
        {STAGE_SEQUENCE.map((code, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          const h = history.get(code);
          const over = h && h.actualDays !== null && h.actualDays > h.expectedDays;
          return (
            <div key={code} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5 text-center w-24">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold",
                    done && "border-forest-600 bg-forest-600 text-white",
                    current && !done && "border-clay bg-clay/10 text-clay",
                    !done && !current && "border-forest-100 bg-white text-ink/35"
                  )}
                >
                  {code}
                </div>
                <p className={cn("text-[11px] leading-tight", current ? "font-medium text-ink" : "text-ink/50")}>
                  {STAGES[code].label}
                </p>
                {h && (
                  <p className={cn("text-[10px]", over ? "text-clay font-medium" : "text-ink/40")}>
                    {h.actualDays !== null ? `${h.actualDays}d` : "in progress"} / {h.expectedDays}d exp.
                  </p>
                )}
              </div>
              {i < STAGE_SEQUENCE.length - 1 && (
                <div className={cn("h-0.5 flex-1 -mt-6", done ? "bg-forest-600" : "bg-forest-100")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
