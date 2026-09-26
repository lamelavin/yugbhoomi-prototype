"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Project, RiskLevel } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import { STAGES } from "@/lib/stages";
import { RISK_HEX } from "@/lib/risk";
import RiskMap from "@/components/RiskMapClient";

const LEVELS: RiskLevel[] = ["Critical", "High", "Medium", "Low"];

export default function MapExplorer({ projects }: { projects: Project[] }) {
  const [visible, setVisible] = useState<Record<RiskLevel, boolean>>({
    Critical: true,
    High: true,
    Medium: true,
    Low: true,
  });
  const [selected, setSelected] = useState<string | undefined>();

  const counts = useMemo(() => {
    const c: Record<RiskLevel, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    projects.forEach((p) => c[p.riskLevel]++);
    return c;
  }, [projects]);

  const shown = projects.filter((p) => visible[p.riskLevel]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-forest-100 bg-paper p-3 shadow-card">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink/45 mr-1">SHOW</span>
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setVisible((v) => ({ ...v, [level]: !v[level] }))}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                visible[level] ? "border-forest-200 bg-white text-ink" : "border-forest-100 bg-forest-50/60 text-ink/30"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RISK_HEX[level] }} />
              {level} {counts[level]}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink/40">
          {shown.length} of {projects.length} sites plotted
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-forest-100 shadow-card">
          <RiskMap projects={shown} selectedId={selected} onSelect={setSelected} height={560} />
        </div>

        <div className="rounded-lg border border-forest-100 bg-paper shadow-card">
          <p className="px-4 pt-4 text-sm font-medium text-forest-700">Sites</p>
          <ul className="mt-2 max-h-[520px] divide-y divide-forest-100 overflow-y-auto">
            {shown.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p.id)}
                  className={`block w-full px-4 py-3 text-left hover:bg-forest-50/60 ${selected === p.id ? "bg-forest-50" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-forest-700">{p.name}</span>
                    <RiskBadge level={p.riskLevel} />
                  </div>
                  <p className="mt-1 text-xs text-ink/45">
                    {p.district}, {p.state} · {p.currentStage} {STAGES[p.currentStage].label}
                  </p>
                  <Link href={`/projects/${p.id}`} className="mt-1 inline-block text-xs font-medium text-forest-600 hover:underline">
                    Open project →
                  </Link>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
