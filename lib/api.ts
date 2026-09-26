import { AssessSiteInput, AssessSiteResult, DashboardStats, DataSource, Project } from "./types";
import { MOCK_PROJECTS, buildDashboardStats } from "./mockData";
import { heuristicAssessment } from "./risk";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TIMEOUT_MS = 3500;

/**
 * YugBhoomi expects a FastAPI backend exposing (adjust paths in this file to
 * match the real service once it is available):
 *
 *   GET  /api/projects           -> Project[]
 *   GET  /api/projects/{id}      -> Project
 *   GET  /api/dashboard          -> DashboardStats
 *   POST /api/assess             -> AssessSiteInput -> AssessSiteResult
 *
 * Every function below tries the live endpoint first. If the backend is
 * unreachable, returns a non-2xx response, or the shape doesn't parse, we
 * fall back to the bundled synthetic dataset so the UI never breaks \u2014 and
 * report which source served the data via the `source` field so screens can
 * show the "Synthetic data" badge honestly.
 */

export interface ApiResult<T> {
  data: T;
  source: DataSource;
  error?: string;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProjects(): Promise<ApiResult<Project[]>> {
  try {
    const data = await fetchJson<Project[]>("/api/projects");
    if (!Array.isArray(data) || data.length === 0) throw new Error("empty response");
    return { data, source: "live" };
  } catch (e) {
    return { data: MOCK_PROJECTS, source: "demo", error: (e as Error).message };
  }
}

export async function getProject(id: string): Promise<ApiResult<Project | null>> {
  try {
    const data = await fetchJson<Project>(`/api/projects/${id}`);
    return { data, source: "live" };
  } catch (e) {
    const found = MOCK_PROJECTS.find((p) => p.id === id) || null;
    return { data: found, source: "demo", error: (e as Error).message };
  }
}

export async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
  try {
    const data = await fetchJson<DashboardStats>("/api/dashboard");
    return { data, source: "live" };
  } catch (e) {
    const { data: projects } = await getProjects();
    return { data: buildDashboardStats(projects), source: "demo", error: (e as Error).message };
  }
}

export async function assessSite(input: AssessSiteInput): Promise<ApiResult<AssessSiteResult>> {
  try {
    const data = await fetchJson<AssessSiteResult>("/api/assess", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { data, source: "live" };
  } catch (e) {
    return { data: heuristicAssessment(input), source: "demo", error: (e as Error).message };
  }
}
