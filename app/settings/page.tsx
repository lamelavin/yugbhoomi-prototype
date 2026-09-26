import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <main>
      <PageHeader title="Settings" description="Environment and API configuration for this deployment." />
      <div className="px-8 pb-12 lg:px-10">
        <div className="max-w-xl rounded-lg border border-forest-100 bg-paper p-6 shadow-card">
          <p className="text-[10.5px] font-medium tracking-wide text-ink/40">API BASE URL</p>
          <p className="mt-1 font-mono text-sm text-forest-700">
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
          </p>
          <p className="mt-3 text-xs text-ink/45">
            Set <code className="rounded bg-forest-50 px-1 py-0.5 font-mono">NEXT_PUBLIC_API_URL</code> in{" "}
            <code className="rounded bg-forest-50 px-1 py-0.5 font-mono">.env.local</code> to point at the FastAPI
            backend. Every screen falls back to the bundled synthetic dataset automatically when this URL is
            unreachable.
          </p>
        </div>
      </div>
    </main>
  );
}
