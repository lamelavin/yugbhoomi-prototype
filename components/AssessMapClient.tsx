"use client";

import dynamic from "next/dynamic";

const AssessMap = dynamic(() => import("./AssessMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg bg-forest-50 text-sm text-ink/40">
      Loading map\u2026
    </div>
  ),
});

export default AssessMap;
