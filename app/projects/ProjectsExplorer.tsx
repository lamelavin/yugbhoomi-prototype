"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Project, RiskLevel } from "@/lib/types";
import { STAGE_SEQUENCE, STAGES } from "@/lib/stages";
import ProjectCard from "@/components/ProjectCard";
import RiskBadge from "@/components/RiskBadge";

const RISK_LEVELS: RiskLevel[] = ["Critical", "High", "Medium", "Low"];

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [sector, setSector] = useState("All");
  const [stage, setStage] = useState("All");
  const [district, setDistrict] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sort, setSort] = useState<"risk" | "delay" | "name">("risk");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");

  const sectors = useMemo(() => uniq(projects.map((p) => p.sector)), [projects]);
  const districts = useMemo(() => uniq(projects.map((p) => p.district)), [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      if (sector !== "All" && p.sector !== sector) return false;
      if (stage !== "All" && p.currentStage !== stage) return false;
      if (district !== "All" && p.district !== district) return false;
      if (risk !== "All" && p.riskLevel !== risk) return false;
      if (query && !`${p.name} ${p.district} ${p.state}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "risk") return b.riskProbability - a.riskProbability;
      if (sort === "delay") return b.delayMaxDays - a.delayMaxDays;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [projects, sector, stage, district, risk, sort, query]);

  return (
    <div>
      <div className="rounded-lg border border-forest-100 bg-paper p-4 shadow-card">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Project, district, state\u2026"
              className="w-52 rounded-md border border-forest-100 bg-white px-3 py-1.5 text-sm outline-none focus:border-forest-400"
            />
          </Field>
          <Field label="Sector">
            <Select value={sector} onChange={setSector} options={["All", ...sectors]} />
          </Field>
          <Field label="Stage">
            <Select value={stage} onChange={setStage} options={["All", ...STAGE_SEQUENCE]} />
          </Field>
          <Field label="District">
            <Select value={district} onChange={setDistrict} options={["All", ...districts]} />
          </Field>
          <Field label="Risk">
            <Select value={risk} onChange={setRisk} options={["All", ...RISK_LEVELS]} />
          </Field>
          <Field label="Sort by">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-md border border-forest-100 bg-white px-3 py-1.5 text-sm outline-none focus:border-forest-400"
            >
              <option value="risk">Risk (worst first)</option>
              <option value="delay">Predicted delay</option>
              <option value="name">Name</option>
            </select>
          </Field>
          <div className="ml-auto flex items-center rounded-md border border-forest-100 bg-white p-0.5 text-sm">
            <button
              onClick={() => setView("cards")}
              className={`rounded px-3 py-1 ${view === "cards" ? "bg-forest-700 text-white" : "text-ink/55"}`}
            >
              Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`rounded px-3 py-1 ${view === "table" ? "bg-forest-700 text-white" : "text-ink/55"}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink/45">
        {filtered.length} of {projects.length} projects
      </p>

      {view === "cards" ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-forest-100 bg-paper shadow-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="text-[10.5px] tracking-wide text-ink/40">
                <th className="px-5 py-3 text-left font-medium">PROJECT</th>
                <th className="px-3 py-3 text-left font-medium">DISTRICT</th>
                <th className="px-3 py-3 text-left font-medium">STAGE</th>
                <th className="px-3 py-3 text-left font-medium">FAMILIES</th>
                <th className="px-3 py-3 text-left font-medium">AREA (HA)</th>
                <th className="px-3 py-3 text-left font-medium">R&amp;R</th>
                <th className="px-3 py-3 text-left font-medium">RISK</th>
                <th className="px-3 py-3 text-left font-medium">DELAY</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-forest-100 hover:bg-forest-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/projects/${p.id}`} className="font-medium text-forest-700 hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-ink/60">{p.district}</td>
                  <td className="px-3 py-3 text-ink/60">
                    <span className="font-mono">{p.currentStage}</span>{" "}
                    <span className="text-ink/40">{STAGES[p.currentStage].label}</span>
                  </td>
                  <td className="px-3 py-3 text-ink/60">{p.affectedFamilies}</td>
                  <td className="px-3 py-3 text-ink/60">{p.areaHectares}</td>
                  <td className="px-3 py-3 text-ink/60">{p.rrProgress}%</td>
                  <td className="px-3 py-3">
                    <RiskBadge level={p.riskLevel} probability={p.riskProbability} />
                  </td>
                  <td className="px-3 py-3 text-ink/60">
                    {p.delayMinDays}\u2013{p.delayMaxDays}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium tracking-wide text-ink/40">{label.toUpperCase()}</p>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-forest-100 bg-white px-3 py-1.5 text-sm outline-none focus:border-forest-400"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? `All ${""}` : o}
        </option>
      ))}
    </select>
  );
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr)).sort();
}
