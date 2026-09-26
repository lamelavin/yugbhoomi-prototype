import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Project } from "@/lib/types";
import { RISK_COLORS } from "@/lib/risk";

export interface FlatAlert {
  id: string;
  projectId: string;
  projectName: string;
  severity: Project["riskLevel"];
  message: string;
  raisedOn: string;
}

export function flattenAlerts(projects: Project[]): FlatAlert[] {
  return projects
    .flatMap((p) => p.alerts.map((a) => ({ ...a, projectId: p.id, projectName: p.name })))
    .sort((a, b) => (a.raisedOn < b.raisedOn ? 1 : -1));
}

export default function AlertsList({ alerts, limit }: { alerts: FlatAlert[]; limit?: number }) {
  const shown = limit ? alerts.slice(0, limit) : alerts;

  if (shown.length === 0) {
    return <p className="text-sm text-ink/45 py-4">No open alerts. Every project is within its expected timeline.</p>;
  }

  return (
    <ul className="divide-y divide-forest-100">
      {shown.map((a) => {
        const c = RISK_COLORS[a.severity];
        return (
          <li key={a.id} className="flex items-start gap-3 py-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.bg}`}>
              <AlertTriangle size={13} className={c.text} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{a.message}</p>
              <p className="mt-0.5 text-xs text-ink/45">
                <Link href={`/projects/${a.projectId}`} className="font-medium text-forest-600 hover:underline">
                  {a.projectName}
                </Link>{" "}
                \u00b7 raised {a.raisedOn}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
