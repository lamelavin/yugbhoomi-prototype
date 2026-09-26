import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DataSourceNote from "@/components/DataSourceNote";
import AlertsList, { flattenAlerts } from "@/components/AlertsList";
import RiskBadge from "@/components/RiskBadge";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const { data: projects, source } = await getProjects();
  const alerts = flattenAlerts(projects);
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 } as Record<string, number>;
  alerts.forEach((a) => (counts[a.severity] = (counts[a.severity] || 0) + 1));

  return (
    <main>
      <PageHeader title="Alerts" description="Projects requiring attention, and why each was flagged." />
      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4">
          <DataSourceNote source={source} />
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          {(["Critical", "High", "Medium", "Low"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2 rounded-lg border border-forest-100 bg-paper px-3 py-2 shadow-card">
              <RiskBadge level={level} />
              <span className="text-sm font-medium text-ink">{counts[level] || 0}</span>
              <span className="text-xs text-ink/40">open</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-forest-100 bg-paper p-5 shadow-card">
          <AlertsList alerts={alerts} />
        </div>
      </div>
    </main>
  );
}
