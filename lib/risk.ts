import { AssessSiteInput, AssessSiteResult, RiskFactor, RiskLevel, StageCode } from "./types";
import { EXPECTED_STAGE_DAYS, stageIndex } from "./stages";

export function riskFromProbability(p: number): RiskLevel {
  if (p >= 85) return "Critical";
  if (p >= 60) return "High";
  if (p >= 30) return "Medium";
  return "Low";
}

export const RISK_COLORS: Record<RiskLevel, { text: string; bg: string; dot: string; ring: string }> = {
  Critical: { text: "text-red-700", bg: "bg-red-50", dot: "bg-red-600", ring: "ring-red-200" },
  High: { text: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500", ring: "ring-orange-200" },
  Medium: { text: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500", ring: "ring-amber-200" },
  Low: { text: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-600", ring: "ring-emerald-200" },
};

export const RISK_HEX: Record<RiskLevel, string> = {
  Critical: "#b3261e",
  High: "#c2703d",
  Medium: "#c98a2c",
  Low: "#1c7a52",
};

/**
 * Local heuristic used as a fallback when the prediction API is unreachable,
 * and to power the "Assess a site" simulation instantly while a live call is
 * in flight. This is NOT the production model \u2014 it exists purely so the
 * frontend degrades gracefully without a backend connection.
 */
export function heuristicAssessment(input: AssessSiteInput): AssessSiteResult {
  const families = input.affectedFamilies ?? 150;
  const disputes = input.anticipatedDisputes ?? 2;
  const compensationReady = clamp(input.compensationReady ?? 40, 0, 100);
  const rrProgress = clamp(input.rrProgress ?? 45, 0, 100);
  const area = input.areaHectares ?? 80;
  const stageStart = stageIndex(input.startingStage);

  let score = 20;
  score += Math.min(disputes, 8) * 6.5;
  score += families > 400 ? 18 : families > 200 ? 11 : families > 80 ? 5 : 0;
  score += area > 200 ? 10 : area > 100 ? 5 : 0;
  score += (100 - compensationReady) * 0.18;
  score += rrProgress < 50 ? (50 - rrProgress) * 0.5 : 0;
  score += stageStart <= 1 ? 6 : 0;
  score = clamp(Math.round(score), 3, 99);

  const level = riskFromProbability(score);

  const factors: RiskFactor[] = [];
  if (disputes >= 3) factors.push({ label: `${disputes} anticipated disputes flagged for this site.` });
  if (families > 200) factors.push({ label: `${families} families would be displaced \u2014 above the portfolio median.` });
  if (compensationReady < 50) factors.push({ label: `Only ${compensationReady}% of compensation cases assumed ready at the outset.` });
  if (rrProgress < 50) factors.push({ label: `Rehabilitation progress of ${rrProgress}% is below the 50% threshold that blocks possession.` });
  if (area > 150) factors.push({ label: `${area} ha is a large acquisition footprint, which historically extends every stage.` });
  if (factors.length === 0) factors.push({ label: "No characteristic stands out as elevated versus the portfolio average." });

  const actions = [
    { action: "Verify title and valuation records before filing the notification.", owner: "Competent Authority (LA)" },
    { action: "Pre-clear likely objections with a local consultation.", owner: "District Collector" },
    { action: "Line up rehabilitation packages ahead of the award.", owner: "R&R administrator" },
  ];

  const delaySpread = Math.round(20 + score * 3.2);

  return {
    riskLevel: level,
    riskProbability: score,
    delayMinDays: Math.max(10, Math.round(delaySpread * 0.4)),
    delayMaxDays: delaySpread,
    topRiskFactors: factors.slice(0, 4),
    recommendedActions: actions,
    modelVersion: "heuristic-fallback-v1",
    isSimulation: true,
  };
}

export function stageProgressRatio(actualDays: number | null, expectedDays: number): number {
  if (actualDays === null) return 0;
  return actualDays / expectedDays;
}

export function expectedDaysFor(stage: StageCode): number {
  return EXPECTED_STAGE_DAYS[stage];
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
