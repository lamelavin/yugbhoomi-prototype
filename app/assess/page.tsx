import { getProjects } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import AssessSiteForm from "./AssessSiteForm";

export const dynamic = "force-dynamic";

export default async function AssessPage() {
  const { data: projects } = await getProjects();

  return (
    <main>
      <PageHeader
        title="Assess a site"
        description="Place a pin and score it. Every field below is optional — leave one blank and a typical value is assumed, and the result says which."
      />
      <div className="px-8 pb-12 lg:px-10">
        <AssessSiteForm projects={projects} />
      </div>
    </main>
  );
}
