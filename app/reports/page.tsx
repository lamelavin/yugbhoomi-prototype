import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DataSourceNote from "@/components/DataSourceNote";
import ReportsView from "./ReportsView";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { data: projects, source } = await getProjects();

  return (
    <main>
      <PageHeader title="Reports" description="A printable risk summary for any project on record." />
      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4 print:hidden">
          <DataSourceNote source={source} />
        </div>
        <ReportsView projects={projects} />
      </div>
    </main>
  );
}
