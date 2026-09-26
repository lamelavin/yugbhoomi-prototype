"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import Link from "next/link";
import { Project } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import { RISK_HEX } from "@/lib/risk";

export default function RiskAnalysisView({ projects }: { projects: Project[] }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId) || projects[0];

  const probData = useMemo(
    () =>
      [...projects]
        .sort((a, b) => b.riskProbability - a.riskProbability)
        .map((p) => ({ name: shortName(p.name), value: p.riskProbability, level: p.riskLevel, id: p.id })),
    [projects]
  );

  const factorFrequency = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
      p.topRiskFactors.forEach((f) => {
        const key = normalizeFactor(f.label);
        counts.set(key, (counts.get(key) || 0) + 1);
      })
    );
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [projects]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
        <h2 className="font-display text-lg text-forest-700">Delay probability by project</h2>
        <p className="text-xs text-ink/45">Click a bar to inspect that project&apos;s explanation below.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={probData} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#eef3f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7268" }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7268" }} domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "#f7f4ec" }}
                formatter={(v: number) => [`${v}%`, "Delay probability"]}
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#d3e2da" }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                onClick={(d: any) => setSelectedId(d.id)}
                cursor="pointer"
              >
                {probData.map((d, i) => (
                  <Cell key={i} fill={RISK_HEX[d.level]} opacity={d.id === selected?.id ? 1 : 0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
        <h2 className="font-display text-lg text-forest-700">Most common risk factors</h2>
        <p className="text-xs text-ink/45">Frequency across all flagged projects in this portfolio.</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factorFrequency} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid horizontal={false} stroke="#eef3f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7268" }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11, fill: "#3d443f" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#d3e2da" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#1c4636" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {selected && (
        <section className="rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-medium tracking-[0.14em] text-ink/40">EXPLANATION FOR</p>
              <Link href={`/projects/${selected.id}`} className="font-display text-xl text-forest-700 hover:underline">
                {selected.name}
              </Link>
            </div>
            <RiskBadge level={selected.riskLevel} probability={selected.riskProbability} size="md" />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[10.5px] font-medium tracking-wide text-ink/40">CONTRIBUTING FACTORS</p>
              <ol className="mt-2 space-y-2">
                {selected.topRiskFactors.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-forest-50">
                      <div
                        className="h-1.5 rounded-full bg-forest-600"
                        style={{ width: `${Math.max(15, 90 - i * 20)}%` }}
                      />
                    </div>
                    <span className="w-52 shrink-0 text-xs text-ink/70">{f.label}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[11px] text-ink/35">
                Bars are illustrative feature weights, ordered as returned by the model \u2014 not a calibrated SHAP
                magnitude, pending that endpoint from the backend.
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-medium tracking-wide text-ink/40">MODEL</p>
              <p className="mt-2 font-mono text-sm text-forest-700">{selected.modelVersion}</p>
              <p className="mt-3 text-[10.5px] font-medium tracking-wide text-ink/40">RECOMMENDED ACTIONS</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {selected.recommendedActions.map((a, i) => (
                  <li key={i} className="flex items-center justify-between rounded bg-forest-50 px-2.5 py-1.5 text-xs">
                    <span className="text-ink/75">{a.action}</span>
                    <span className="font-medium text-forest-700">{a.owner}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function shortName(name: string) {
  const m = name.match(/^(NH-\d+[A-Za-z]?)/);
  return m ? m[1] : name.slice(0, 10);
}

function normalizeFactor(label: string) {
  return label
    .replace(/^\d+ /, "")
    .replace(/\d+(\.\d+)?/g, "N")
    .trim();
}
