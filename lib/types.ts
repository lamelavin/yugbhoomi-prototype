export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type StageCode = "3A" | "3C" | "3D" | "3G" | "3H" | "3E";

export interface StageMeta {
  code: StageCode;
  label: string;
  description: string;
}

export interface RiskFactor {
  label: string;
  detail?: string;
}

export interface RecommendedAction {
  action: string;
  owner: string;
}

export interface Project {
  id: string;
  index: number;
  name: string;
  sector: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  currentStage: StageCode;
  areaHectares: number;
  affectedFamilies: number;
  rrProgress: number; // 0-100
  compensationReady: number; // 0-100
  riskLevel: RiskLevel;
  riskProbability: number; // 0-100
  delayMinDays: number;
  delayMaxDays: number;
  topRiskFactors: RiskFactor[];
  recommendedActions: RecommendedAction[];
  modelVersion: string;
  stageHistory: { stage: StageCode; enteredOn: string; expectedDays: number; actualDays: number | null }[];
  alerts: { id: string; severity: RiskLevel; message: string; raisedOn: string }[];
  photos: { caption: string }[];
  lastUpdated: string;
}

export interface DashboardStats {
  projectsMonitored: number;
  landUnderAcquisitionHa: number;
  familiesAffected: number;
  meanRrProgress: number;
  needingAttention: number;
  riskDistribution: Record<RiskLevel, number>;
}

export interface AssessSiteInput {
  location: string;
  areaHectares: number | null;
  affectedFamilies: number | null;
  anticipatedDisputes: number | null;
  compensationReady: number | null;
  rrProgress: number | null;
  startingStage: StageCode;
  lat?: number;
  lng?: number;
}

export interface AssessSiteResult {
  riskLevel: RiskLevel;
  riskProbability: number;
  delayMinDays: number;
  delayMaxDays: number;
  topRiskFactors: RiskFactor[];
  recommendedActions: RecommendedAction[];
  modelVersion: string;
  isSimulation: true;
}

export type DataSource = "live" | "demo";
