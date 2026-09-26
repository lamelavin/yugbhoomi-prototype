import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDashboardStats, getProjects } from "@/lib/api";
import StatCard from "@/components/StatCard";
import RiskDonut from "@/components/RiskDonut";
import RiskBadge from "@/components/RiskBadge";
import DataSourceNote from "@/components/DataSourceNote";
import AlertsList, { flattenAlerts } from "@/components/AlertsList";
import PageHeader from "@/components/PageHeader";
import { STAGES } from "@/lib/stages";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [statsRes, projectsRes] = await Promise.all([getDashboardStats(), getProjects()]);
  const stats = statsRes.data;
  const projects = projectsRes.data;
  const attention = [...projects]
    .filter((p) => p.riskLevel === "High" || p.riskLevel === "Critical")
    .sort((a, b) => b.riskProbability - a.riskProbability);
  const alerts = flattenAlerts(projects);

  return (
    <main>
      <PageHeader
        eyebrow="MINISTRY OF RURAL DEVELOPMENT · PROTOTYPE"
        title="Transparent land acquisition. Timely infrastructure."
        description="Real-time monitoring and AI-driven insights for delay risk prediction and decision support across National Highway acquisition."
        actions={
          <>
            <Link href="/projects" className="rounded-md bg-forest-700 px-4 py-2 text-sm font-medium text-white hover:bg-forest-600">
              View projects
            </Link>
            <Link href="/map" className="rounded-md border border-forest-200 px-4 py-2 text-sm font-medium text-forest-700 hover:bg-forest-50">
              Map view
            </Link>
          </>
        }
      />

      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4">
          <DataSourceNote
            source={statsRes.source}
            note={statsRes.source === "live" ? "figures below are computed from the projects on record, not illustrative placeholders." : undefined}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Projects monitored" value={stats.projectsMonitored} caption="in this portfolio" />
          <StatCard label="Land under acquisition" value={stats.landUnderAcquisitionHa} suffix="ha" caption="across all projects" />
          <StatCard label="Families affected" value={stats.familiesAffected.toLocaleString()} caption="project-affected families" />
          <StatCard label="Mean R&R progress" value={stats.meanRrProgress} suffix="%" caption="rehabilitation & resettlement" />
          <StatCard label="Needing attention" value={stats.needingAttention} caption="High or Critical risk" accent="warn" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
            <h2 className="font-display text-lg text-forest-700">Risk overview</h2>
            <p className="text-xs text-ink/45">Distribution across the portfolio</p>
            <div className="mt-4">
              <RiskDonut distribution={stats.riskDistribution} />
            </div>
          </div>

          <div className="rounded-lg border border-forest-100 bg-paper shadow-card">
            <div className="flex items-center justify-between px-5 pt-5">
              <div>
                <h2 className="font-display text-lg text-forest-700">Projects needing attention</h2>
                <p className="text-xs text-ink/45">High and Critical risk, worst first</p>
              </div>
              <Link href="/projects" className="flex items-center gap-1 text-xs font-medium text-forest-600 hover:underline">
                All projects <ArrowRight size={12} />
              </Link>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-t border-forest-100 text-[10.5px] tracking-wide text-ink/40">
                    <th className="px-5 py-2 text-left font-medium">PROJECT</th>
                    <th className="px-3 py-2 text-left font-medium">DISTRICT</th>
                    <th className="px-3 py-2 text-left font-medium">CURRENT STAGE</th>
                    <th className="px-3 py-2 text-left font-medium">RISK</th>
                    <th className="px-3 py-2 text-left font-medium">PREDICTED DELAY</th>
                    <th className="px-5 py-2 text-left font-medium">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {attention.map((p) => (
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
                      <td className="px-3 py-3">
                        <RiskBadge level={p.riskLevel} probability={p.riskProbability} />
                      </td>
                      <td className="px-3 py-3 text-ink/60">
                        {p.delayMinDays}\u2013{p.delayMaxDays} days
                      </td>
                      <td className="px-5 py-3 text-ink/60">{p.recommendedActions[0]?.action}</td>
                    </tr>
                  ))}
                  {attention.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-6 text-center text-ink/40">
                        No High or Critical risk projects on record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-forest-700">Recent alerts</h2>
            <Link href="/alerts" className="flex items-center gap-1 text-xs font-medium text-forest-600 hover:underline">
              All alerts <ArrowRight size={12} />
            </Link>
          </div>
          <AlertsList alerts={alerts} limit={4} />
        </div>
      </div>
    </main>
  );
}
