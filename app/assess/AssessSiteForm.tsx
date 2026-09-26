"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Project, AssessSiteInput, AssessSiteResult, StageCode } from "@/lib/types";
import { STAGE_SEQUENCE, STAGES } from "@/lib/stages";
import { assessSite } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import AssessMap from "@/components/AssessMapClient";

const DEFAULT_CENTER = { lat: 22.7196, lng: 75.8577 }; // Indore, used as a sensible default centre

export default function AssessSiteForm({ projects }: { projects: Project[] }) {
  const [location, setLocation] = useState("Indore");
  const [pin, setPin] = useState(DEFAULT_CENTER);
  const [area, setArea] = useState<string>("");
  const [families, setFamilies] = useState<string>("");
  const [disputes, setDisputes] = useState<string>("");
  const [compensationReady, setCompensationReady] = useState<string>("");
  const [rrProgress, setRrProgress] = useState<string>("");
  const [startingStage, setStartingStage] = useState<StageCode>("3A");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessSiteResult | null>(null);
  const [resultSource, setResultSource] = useState<"live" | "demo" | null>(null);

  async function handleSubmit() {
    setLoading(true);
    const input: AssessSiteInput = {
      location,
      areaHectares: numOrNull(area),
      affectedFamilies: numOrNull(families),
      anticipatedDisputes: numOrNull(disputes),
      compensationReady: numOrNull(compensationReady),
      rrProgress: numOrNull(rrProgress),
      startingStage,
      lat: pin.lat,
      lng: pin.lng,
    };
    const res = await assessSite(input);
    setResult(res.data);
    setResultSource(res.source);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium">An estimate, not a prediction about a real project.</p>
          <p className="mt-1 text-amber-700/90">
            The location is recorded but <span className="font-medium">not used in scoring</span> — the model has
            no location feature, so this says nothing about this district specifically. What it answers is
            &ldquo;what would a project with these characteristics look like&rdquo;.
          </p>
        </div>

        <div className="mt-4 h-[420px] overflow-hidden rounded-lg border border-forest-100 shadow-card">
          <AssessMap projects={projects} selected={pin} onPick={(lat, lng) => setPin({ lat, lng })} />
        </div>
        <p className="mt-2 text-xs text-ink/40">
          Selected: {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)} \u00b7 coloured pins are the {projects.length} existing
          projects, at their current risk level.
        </p>
      </div>

      <div className="rounded-lg border border-forest-100 bg-paper p-6 shadow-card h-fit">
        <h2 className="font-display text-lg text-forest-700">Expected characteristics</h2>
        <p className="text-xs text-ink/45">Optional. Placeholders show what will be assumed if you skip a field.</p>

        <div className="mt-4 space-y-4">
          <Field label="Location *" hint="District and state. Recorded for the map — not used in scoring.">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Area (hectares)" hint="Total land proposed for acquisition.">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="80"
                className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
              />
            </Field>
            <Field label="Affected families" hint="Families displaced. Larger displacement slows acquisition.">
              <input
                type="number"
                value={families}
                onChange={(e) => setFamilies(e.target.value)}
                placeholder="150"
                className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Anticipated disputes" hint="Title or valuation challenges you expect. The strongest single signal.">
              <input
                type="number"
                value={disputes}
                onChange={(e) => setDisputes(e.target.value)}
                placeholder="2"
                className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
              />
            </Field>
            <Field label="Compensation ready (%)" hint="Share of compensation cases already processed at the outset.">
              <input
                type="number"
                value={compensationReady}
                onChange={(e) => setCompensationReady(e.target.value)}
                placeholder="40"
                className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
              />
            </Field>
          </div>

          <Field label="Rehabilitation progress (%)" hint="R&R below 50% blocks possession regardless of how the award progresses.">
            <input
              type="number"
              value={rrProgress}
              onChange={(e) => setRrProgress(e.target.value)}
              placeholder="45"
              className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
            />
          </Field>

          <Field label="Starting stage" hint="Where the acquisition would begin in the statutory sequence.">
            <select
              value={startingStage}
              onChange={(e) => setStartingStage(e.target.value as StageCode)}
              className="w-full rounded-md border border-forest-100 bg-white px-3 py-2 text-sm outline-none focus:border-forest-400"
            >
              {STAGE_SEQUENCE.map((code) => (
                <option key={code} value={code}>
                  {code} — {STAGES[code].label}
                </option>
              ))}
            </select>
          </Field>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Estimate delay risk
          </button>
        </div>

        {result && (
          <div className="mt-6 border-t border-forest-100 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-ink/40">SIMULATED RESULT</p>
              {resultSource === "demo" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-gold">
                  <AlertTriangle size={11} /> heuristic fallback
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <RiskBadge level={result.riskLevel} probability={result.riskProbability} size="md" />
              <span className="text-sm text-ink/55">
                {result.delayMinDays}\u2013{result.delayMaxDays} days
              </span>
            </div>
            <ol className="mt-4 space-y-1.5 text-[13px] text-ink/70">
              {result.topRiskFactors.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink/35">{i + 1}.</span>
                  {f.label}
                </li>
              ))}
            </ol>
            <ul className="mt-4 space-y-2">
              {result.recommendedActions.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded bg-forest-50 px-2.5 py-1.5 text-xs">
                  <span className="text-ink/75">{a.action}</span>
                  <span className="font-medium text-forest-700">{a.owner}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[10px] text-ink/35">model: {result.modelVersion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}

function numOrNull(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
