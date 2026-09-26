"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DashboardStats, RiskLevel } from "@/lib/types";
import { RISK_HEX } from "@/lib/risk";

const ORDER: RiskLevel[] = ["Critical", "High", "Medium", "Low"];

export default function RiskDonut({ distribution }: { distribution: DashboardStats["riskDistribution"] }) {
  const total = ORDER.reduce((s, k) => s + distribution[k], 0);
  const data = ORDER.map((level) => ({ name: level, value: distribution[level] })).filter((d) => d.value > 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length ? data : [{ name: "None", value: 1 }]}
              dataKey="value"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={data.length > 1 ? 3 : 0}
              stroke="none"
            >
              {(data.length ? data : [{ name: "None", value: 1 }]).map((entry, i) => (
                <Cell key={i} fill={data.length ? RISK_HEX[entry.name as RiskLevel] : "#e5e2d8"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-forest-700">{total}</span>
          <span className="text-[10px] tracking-wide text-ink/45">PROJECTS</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {ORDER.map((level) => (
          <li key={level} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_HEX[level] }} />
            <span className="w-16 text-ink/70">{level}</span>
            <span className="font-medium text-ink">{distribution[level]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
