"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Project } from "@/lib/types";
import { STAGES } from "@/lib/stages";
import RiskBadge from "@/components/RiskBadge";
import ProgressBar from "@/components/ProgressBar";

export default function ReportsView({ projects }: { projects: Project[] }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-lg border border-forest-100 bg-paper p-3 shadow-card h-fit print:hidden">
        <p className="px-2 py-1 text-[10.5px] font-medium tracking-wide text-ink/40">SELECT A PROJECT</p>
        <ul className="mt-1 space-y-0.5">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelectedId(p.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                  selectedId === p.id ? "bg-forest-700 text-white" : "text-ink/75 hover:bg-forest-50"
                }`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div className="rounded-lg border border-forest-100 bg-white p-8 shadow-card print:border-none print:shadow-none">
          <div className="flex items-start justify-between border-b border-forest-100 pb-5">
            <div>
              <p className="text-[10.5px] font-medium tracking-[0.16em] text-ink/40">
                YUGBHOOMI \u00b7 PROJECT RISK SUMMARY \u00b7 {today}
              </p>
              <h2 className="mt-1 font-display text-2xl text-forest-700">{selected.name}</h2>
              <p className="mt-1 text-sm text-ink/55">
                {selected.district}, {selected.state} \u00b7 {selected.sector} \u00b7 #{selected.index}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md bg-forest-700 px-3 py-2 text-xs font-medium text-white hover:bg-forest-600 print:hidden"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <SummaryStat label="Risk level" value={<RiskBadge level={selected.riskLevel} probability={selected.riskProbability} />} />
            <SummaryStat label="Predicted delay" value={`${selected.delayMinDays}\u2013${selected.delayMaxDays} days`} />
            <SummaryStat label="Current stage" value={`${selected.currentStage} \u2014 ${STAGES[selected.currentStage].label}`} />
            <SummaryStat label="Model" value={selected.modelVersion} mono />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ProgressBar label="R&R progress" value={selected.rrProgress} warnBelow={50} />
            <ProgressBar label="Compensation ready" value={selected.compensationReady} warnBelow={50} />
          </div>

          <div className="mt-6">
            <p className="text-[10.5px] font-medium tracking-wide text-ink/40">RISK FACTORS</p>
            <ol className="mt-2 space-y-1.5 text-sm text-ink/75">
              {selected.topRiskFactors.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink/35">{i + 1}.</span>
                  {f.label}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6">
            <p className="text-[10.5px] font-medium tracking-wide text-ink/40">RECOMMENDED ACTIONS</p>
            <ul className="mt-2 divide-y divide-forest-100 text-sm">
              {selected.recommendedActions.map((a, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-ink/80">{a.action}</span>
                  <span className="rounded bg-forest-50 px-2 py-1 text-xs font-medium text-forest-700">{a.owner}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-[10.5px] font-medium tracking-wide text-ink/40">OPEN ALERTS</p>
            {selected.alerts.length === 0 ? (
              <p className="mt-2 text-sm text-ink/45">None on record.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm">
                {selected.alerts.map((a) => (
                  <li key={a.id} className="text-ink/75">
                    \u2022 {a.message} <span className="text-ink/35">({a.raisedOn})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="mt-8 border-t border-forest-100 pt-4 text-[10px] text-ink/35">
            YUGBHOOMI \u00b7 SIH26017 \u00b7 Prototype on synthetic data. Decision support for a human officer, not a
            decision-maker. Not an official Government of India application.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-md bg-forest-50/60 p-3">
      <p className="text-[10px] font-medium tracking-wide text-ink/40">{label.toUpperCase()}</p>
      <div className={`mt-1 text-sm ${mono ? "font-mono" : "font-medium"} text-forest-700`}>{value}</div>
    </div>
  );
}
