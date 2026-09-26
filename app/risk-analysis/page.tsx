import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DataSourceNote from "@/components/DataSourceNote";
import RiskAnalysisView from "./RiskAnalysisView";

export const dynamic = "force-dynamic";

export default async function RiskAnalysisPage() {
  const { data: projects, source } = await getProjects();

  return (
    <main>
      <PageHeader
        title="Risk analysis"
        description="How the model reads the portfolio, and which factors are driving flags right now."
      />
      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4">
          <DataSourceNote source={source} />
        </div>
        <RiskAnalysisView projects={projects} />
      </div>
    </main>
  );
}
