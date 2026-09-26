import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, MapPin } from "lucide-react";
import { getProject } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import ProgressBar from "@/components/ProgressBar";
import StageTimeline from "@/components/StageTimeline";
import DataSourceNote from "@/components/DataSourceNote";
import { STAGES } from "@/lib/stages";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: project, source } = await getProject(params.id);
  if (!project) notFound();

  return (
    <main className="px-8 py-8 lg:px-10">
      <Link href="/projects" className="flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:underline">
        <ArrowLeft size={14} /> All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-medium tracking-[0.14em] text-ink/40">
            {project.sector.toUpperCase()} · #{project.index} · UPDATED {project.lastUpdated}
          </p>
          <h1 className="mt-1 font-display text-3xl text-forest-700">{project.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/55">
            <MapPin size={14} /> {project.district}, {project.state}
          </p>
        </div>
        <div className="text-right">
          <RiskBadge level={project.riskLevel} probability={project.riskProbability} size="md" />
          <p className="mt-1.5 text-sm text-ink/50">
            predicted delay {project.delayMinDays}\u2013{project.delayMaxDays} days
          </p>
        </div>
      </div>

      <div className="mt-3">
        <DataSourceNote source={source} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label="Area" value={`${project.areaHectares} ha`} />
        <Metric label="Affected families" value={project.affectedFamilies} />
        <Metric label="Current stage" value={`${project.currentStage} — ${STAGES[project.currentStage].label}`} mono />
        <Metric label="Model version" value={project.modelVersion} mono small />
      </div>

      <section className="mt-8 rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
        <h2 className="font-display text-lg text-forest-700">Acquisition progress</h2>
        <p className="text-xs text-ink/45">Statutory sequence, expected vs. actual duration per stage</p>
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="min-w-[720px]">
            <StageTimeline project={project} />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
          <h2 className="font-display text-lg text-forest-700">Rehabilitation & compensation</h2>
          <div className="mt-4 space-y-4">
            <ProgressBar label="R&R progress" value={project.rrProgress} warnBelow={50} />
            <ProgressBar label="Compensation ready" value={project.compensationReady} warnBelow={50} />
          </div>
          {project.rrProgress < 50 && (
            <p className="mt-4 rounded-md bg-clay/10 px-3 py-2 text-xs text-clay">
              R&amp;R below 50% blocks possession regardless of how the award progresses.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
          <h2 className="font-display text-lg text-forest-700">Top risk factors</h2>
          <p className="text-xs text-ink/45">Explanation of the current risk score</p>
          <ol className="mt-4 space-y-2.5 text-sm text-ink/75">
            {project.topRiskFactors.map((f, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-50 text-[11px] font-medium text-forest-700">
                  {i + 1}
                </span>
                {f.label}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
        <h2 className="font-display text-lg text-forest-700">Recommended actions</h2>
        <ul className="mt-4 divide-y divide-forest-100">
          {project.recommendedActions.map((a, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink/80">{a.action}</span>
              <span className="rounded bg-forest-50 px-2 py-1 text-xs font-medium text-forest-700">{a.owner}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
          <h2 className="font-display text-lg text-forest-700">Alerts</h2>
          {project.alerts.length === 0 ? (
            <p className="mt-3 text-sm text-ink/45">No open alerts for this project.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {project.alerts.map((a) => (
                <li key={a.id} className="rounded-md border border-forest-100 p-3">
                  <div className="flex items-center justify-between">
                    <RiskBadge level={a.severity} />
                    <span className="text-xs text-ink/40">{a.raisedOn}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/75">{a.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
          <h2 className="font-display text-lg text-forest-700">Site photographs</h2>
          {project.photos.length === 0 ? (
            <p className="mt-3 text-sm text-ink/45">No photographs on file for this site yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {project.photos.map((p, i) => (
                <div key={i} className="rounded-md border border-forest-100 bg-forest-50 p-4">
                  <div className="flex h-20 items-center justify-center text-forest-300">
                    <ImageIcon size={28} strokeWidth={1.4} />
                  </div>
                  <p className="mt-2 text-xs text-ink/55">{p.caption}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, mono, small }: { label: string; value: string | number; mono?: boolean; small?: boolean }) {
  return (
    <div className="rounded-lg border border-forest-100 bg-paper p-4 shadow-card">
      <p className="text-[10px] font-medium tracking-wide text-ink/40">{label.toUpperCase()}</p>
      <p className={`mt-1.5 text-forest-700 ${mono ? "font-mono" : "font-display"} ${small ? "text-sm" : "text-lg"}`}>
        {value}
      </p>
    </div>
  );
}
