import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DataSourceNote from "@/components/DataSourceNote";
import MapExplorer from "./MapExplorer";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const { data: projects, source } = await getProjects();

  return (
    <main>
      <PageHeader title="Map view" description="Acquisition sites by location, coloured by current delay risk." />
      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4">
          <DataSourceNote source={source} />
        </div>
        <MapExplorer projects={projects} />
        <p className="mt-6 text-xs text-ink/40">
          YUGBHOOMI · SIH26017 · Decision support for a human officer, not a decision-maker.
        </p>
      </div>
    </main>
  );
}
