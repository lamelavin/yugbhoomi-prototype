import PageHeader from "@/components/PageHeader";
import { FolderOpen } from "lucide-react";

export default function DocumentsPage() {
  return (
    <main>
      <PageHeader title="Documents" description="Notifications, declarations and awards filed against each project." />
      <div className="px-8 pb-12 lg:px-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-forest-200 bg-paper py-20 text-center">
          <FolderOpen size={28} className="text-forest-300" strokeWidth={1.4} />
          <p className="mt-3 font-display text-lg text-forest-700">Document store not yet connected</p>
          <p className="mt-1 max-w-sm text-sm text-ink/50">
            This screen is reserved for statutory filings once the backend exposes a document endpoint. Wire it to{" "}
            <code className="rounded bg-forest-50 px-1 py-0.5 font-mono text-xs">/api/documents</code> when ready.
          </p>
        </div>
      </div>
    </main>
  );
}
