import Link from "next/link";
import { STAGE_SEQUENCE, STAGES } from "@/lib/stages";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-forest-800 text-white">
        <HeroBackdrop />
        <div className="relative z-10 px-8 pt-14 pb-24 lg:px-14 lg:pt-16 lg:pb-28 max-w-4xl">
          <p className="text-[11px] font-medium tracking-[0.16em] text-emerald-300/80">
            SIH26017 · MINISTRY OF RURAL DEVELOPMENT · PROTOTYPE
          </p>
          <h1 className="mt-5 font-display text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight">
            Land acquisition delays are visible long before they become official.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-forest-50/75">
            Existing systems record where a project stands today. YUGBHOOMI reads the same process data and
            estimates where it is heading \u2014 early enough for an officer to act, with the reasoning shown every
            time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-forest-800 hover:bg-forest-50 transition-colors"
            >
              Open the monitoring dashboard
            </Link>
            <Link
              href="/assess"
              className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Assess a site
            </Link>
          </div>

          <div className="mt-14">
            <p className="text-[10.5px] font-medium tracking-[0.16em] text-forest-50/45">
              TRACKED ACROSS THE STATUTORY SEQUENCE
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {STAGE_SEQUENCE.map((code, i) => (
                <div key={code} className="flex items-center gap-2">
                  <span
                    title={STAGES[code].label}
                    className="rounded border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-xs font-medium text-white/85"
                  >
                    {code}
                  </span>
                  {i < STAGE_SEQUENCE.length - 1 && <ArrowRight size={13} className="text-white/25" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 px-8 py-12 lg:grid-cols-2 lg:px-14">
        <div className="rounded-lg border border-forest-100 bg-paper p-7 shadow-card">
          <p className="text-[10.5px] font-medium tracking-[0.14em] text-ink/40">A SYSTEM OF RECORD ANSWERS</p>
          <h2 className="mt-2 font-display text-2xl text-forest-700">&ldquo;Where is this project now?&rdquo;</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Notifications issued, payments released, current stage. Accurate, necessary, and entirely
            retrospective \u2014 by the time a delay appears here, it has already happened.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-800/15 bg-forest-700 p-7 text-white shadow-card">
          <p className="text-[10.5px] font-medium tracking-[0.14em] text-emerald-300/70">YUGBHOOMI ANSWERS</p>
          <h2 className="mt-2 font-display text-2xl">&ldquo;Which of these will slip, and why?&rdquo;</h2>
          <p className="mt-3 text-sm leading-relaxed text-forest-50/75">
            A ranked caseload, the factors behind every flag, an owned action for each, and a simulator to test
            interventions before you commit resources to them.
          </p>
        </div>
      </section>
    </main>
  );
}

function HeroBackdrop() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.35]"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#163a2c" />
          <stop offset="100%" stopColor="#081a14" />
        </linearGradient>
      </defs>
      <rect width="1200" height="500" fill="url(#g1)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={-100 + i * 220}
          y1="600"
          x2={300 + i * 220}
          y2="-100"
          stroke="#eef3f0"
          strokeOpacity={0.06}
          strokeWidth="90"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={200 + i * 220} cy={120 + (i % 2) * 60} r="2" fill="#6bd3a0" opacity="0.5" />
      ))}
    </svg>
  );
}
