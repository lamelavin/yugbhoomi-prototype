import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "@/lib/types";
import RiskBadge from "./RiskBadge";
import { STAGES } from "@/lib/stages";

export default function ProjectCard({ project }: { project: Project }) {
  const stage = STAGES[project.currentStage];
  return (
    <div className="rounded-lg border-l-4 border border-forest-100 bg-paper shadow-card overflow-hidden flex flex-col"
      style={{ borderLeftColor: riskBorder(project.riskLevel) }}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-snug text-forest-700">{project.name}</h3>
            <p className="mt-0.5 text-sm text-ink/50">
              {project.district}, {project.state} · {project.sector} · #{project.index}
            </p>
          </div>
          <div className="text-right shrink-0">
            <RiskBadge level={project.riskLevel} probability={project.riskProbability} />
            <p className="mt-1 text-xs text-ink/45">delay {project.delayMinDays}\u2013{project.delayMaxDays} days</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-forest-700 px-2 py-1 font-mono font-medium text-white">{project.currentStage}</span>
          <span className="text-ink/55">{project.affectedFamilies} families</span>
          <span className="text-ink/30">·</span>
          <span className="text-ink/55">{project.areaHectares} ha</span>
          <span className="text-ink/30">·</span>
          <span className="text-ink/55">R&amp;R {project.rrProgress}%</span>
        </div>

        <div className="mt-4 border-t border-forest-100 pt-3">
          <p className="text-[10.5px] font-medium tracking-[0.1em] text-ink/40">TOP RISK FACTORS</p>
          <ol className="mt-1.5 space-y-1 text-[13px] text-ink/70">
            {project.topRiskFactors.slice(0, 3).map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-ink/35">{i + 1}.</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="flex items-center justify-between border-t border-forest-100 px-5 py-3 text-sm font-medium text-forest-700 hover:bg-forest-50"
      >
        Open project
        <span className="flex items-center gap-1.5">
          <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  );
}

function riskBorder(level: Project["riskLevel"]) {
  switch (level) {
    case "Critical":
      return "#b3261e";
    case "High":
      return "#c2703d";
    case "Medium":
      return "#c98a2c";
    default:
      return "#1c7a52";
  }
}
