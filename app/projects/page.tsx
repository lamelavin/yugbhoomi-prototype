import Link from "next/link";
import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DataSourceNote from "@/components/DataSourceNote";
import ProjectsExplorer from "./ProjectsExplorer";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: projects, source } = await getProjects();

  return (
    <main>
      <PageHeader
        title="Projects"
        description="Every acquisition on record, ranked by delay risk."
        actions={
          <Link href="/assess" className="rounded-md bg-forest-700 px-4 py-2 text-sm font-medium text-white hover:bg-forest-600">
            Analyse a new site
          </Link>
        }
      />
      <div className="px-8 pb-12 lg:px-10">
        <div className="mb-4">
          <DataSourceNote source={source} />
        </div>
        <ProjectsExplorer projects={projects} />
      </div>
    </main>
  );
}
