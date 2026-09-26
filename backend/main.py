"""
YugBhoomi backend — single-file FastAPI service.

Implements exactly the four endpoints the frontend (lib/api.ts) expects:

    GET  /api/projects
    GET  /api/projects/{id}
    GET  /api/dashboard
    POST /api/assess

Run with:
    pip install fastapi uvicorn --break-system-packages
    uvicorn main:app --reload --port 8000

The frontend reads NEXT_PUBLIC_API_URL (defaults to http://localhost:8000),
so no frontend changes are needed as long as this runs on port 8000.
"""

from __future__ import annotations

from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Models (mirror lib/types.ts)
# ---------------------------------------------------------------------------

RiskLevel = Literal["Low", "Medium", "High", "Critical"]
StageCode = Literal["3A", "3C", "3D", "3G", "3H", "3E"]


class RiskFactor(BaseModel):
    label: str
    detail: Optional[str] = None


class RecommendedAction(BaseModel):
    action: str
    owner: str


class StageHistoryEntry(BaseModel):
    stage: StageCode
    enteredOn: str
    expectedDays: int
    actualDays: Optional[int] = None


class Alert(BaseModel):
    id: str
    severity: RiskLevel
    message: str
    raisedOn: str


class Photo(BaseModel):
    caption: str


class Project(BaseModel):
    id: str
    index: int
    name: str
    sector: str
    state: str
    district: str
    lat: float
    lng: float
    currentStage: StageCode
    areaHectares: float
    affectedFamilies: int
    rrProgress: int
    compensationReady: int
    riskLevel: RiskLevel
    riskProbability: int
    delayMinDays: int
    delayMaxDays: int
    topRiskFactors: list[RiskFactor]
    recommendedActions: list[RecommendedAction]
    modelVersion: str
    stageHistory: list[StageHistoryEntry]
    alerts: list[Alert]
    photos: list[Photo]
    lastUpdated: str


class DashboardStats(BaseModel):
    projectsMonitored: int
    landUnderAcquisitionHa: float
    familiesAffected: int
    meanRrProgress: int
    needingAttention: int
    riskDistribution: dict[RiskLevel, int]


class AssessSiteInput(BaseModel):
    location: str
    areaHectares: Optional[float] = None
    affectedFamilies: Optional[int] = None
    anticipatedDisputes: Optional[int] = None
    compensationReady: Optional[float] = None
    rrProgress: Optional[float] = None
    startingStage: StageCode = "3A"
    lat: Optional[float] = None
    lng: Optional[float] = None


class AssessSiteResult(BaseModel):
    riskLevel: RiskLevel
    riskProbability: int
    delayMinDays: int
    delayMaxDays: int
    topRiskFactors: list[RiskFactor]
    recommendedActions: list[RecommendedAction]
    modelVersion: str
    isSimulation: Literal[True] = True


# ---------------------------------------------------------------------------
# Seed data (mirrors lib/mockData.ts so the UI shows identical numbers once
# it's talking to this real backend instead of falling back to the bundled
# synthetic dataset)
# ---------------------------------------------------------------------------

PROJECTS: list[Project] = [
    Project(
        id="nh-48-surat", index=3, name="NH-48 Rajmarg Extension — Surat Corridor",
        sector="National Highway", state="Gujarat", district="Surat",
        lat=21.1702, lng=72.8311, currentStage="3G", areaHectares=210,
        affectedFamilies=445, rrProgress=34, compensationReady=41,
        riskLevel="Critical", riskProbability=99, delayMinDays=79, delayMaxDays=394,
        topRiskFactors=[
            RiskFactor(label="4 unresolved legal disputes."),
            RiskFactor(label="Earlier stages averaged 45 days each."),
            RiskFactor(label="Compensation pending for 59% of affected families."),
            RiskFactor(label="3G stage is at 3.3x its expected duration."),
        ],
        recommendedActions=[
            RecommendedAction(action="Prioritise compensation verification", owner="Competent Authority (LA)"),
            RecommendedAction(action="Escalate unresolved cases to the legal cell", owner="Legal cell"),
            RecommendedAction(action="Schedule a district-level review within seven days", owner="District Collector"),
            RecommendedAction(action="Assign an additional field officer", owner="Nodal officer"),
        ],
        modelVersion="logistic_regression_v1",
        stageHistory=[
            StageHistoryEntry(stage="3A", enteredOn="2024-11-02", expectedDays=30, actualDays=41),
            StageHistoryEntry(stage="3C", enteredOn="2024-12-13", expectedDays=45, actualDays=63),
            StageHistoryEntry(stage="3D", enteredOn="2025-02-14", expectedDays=40, actualDays=58),
            StageHistoryEntry(stage="3G", enteredOn="2025-04-13", expectedDays=60, actualDays=None),
        ],
        alerts=[
            Alert(id="a1", severity="Critical", message="Compensation verification overdue by 61 days at 3G.", raisedOn="2026-09-10"),
            Alert(id="a2", severity="High", message="4 legal disputes remain unresolved ahead of award.", raisedOn="2026-09-04"),
        ],
        photos=[Photo(caption="Corridor alignment near km 14, Surat bypass"), Photo(caption="Compensation camp, Ward 9")],
        lastUpdated="2026-09-18",
    ),
    Project(
        id="nh-44-nagpur", index=1, name="NH-44 Nagpur Bypass — Package III",
        sector="National Highway", state="Maharashtra", district="Nagpur",
        lat=21.1458, lng=79.0882, currentStage="3D", areaHectares=142.5,
        affectedFamilies=312, rrProgress=48, compensationReady=55,
        riskLevel="Critical", riskProbability=93, delayMinDays=56, delayMaxDays=157,
        topRiskFactors=[
            RiskFactor(label="Earlier stages averaged 45 days each."),
            RiskFactor(label="2 unresolved legal disputes."),
            RiskFactor(label="3D stage is at 2.9x its expected duration."),
            RiskFactor(label="Currently at stage 3D."),
        ],
        recommendedActions=[
            RecommendedAction(action="Schedule a district-level review within seven days", owner="District Collector"),
            RecommendedAction(action="Assign an additional field officer", owner="Nodal officer"),
            RecommendedAction(action="Accelerate the rehabilitation plan", owner="R&R administrator"),
            RecommendedAction(action="Follow up on outstanding compensation", owner="Competent Authority (LA)"),
        ],
        modelVersion="logistic_regression_v1",
        stageHistory=[
            StageHistoryEntry(stage="3A", enteredOn="2025-01-06", expectedDays=30, actualDays=33),
            StageHistoryEntry(stage="3C", enteredOn="2025-02-08", expectedDays=45, actualDays=52),
            StageHistoryEntry(stage="3D", enteredOn="2025-04-01", expectedDays=40, actualDays=None),
        ],
        alerts=[Alert(id="a3", severity="High", message="Declaration stage running 2.9x its expected duration.", raisedOn="2026-09-12")],
        photos=[Photo(caption="Bypass Package III, chainage 6+200")],
        lastUpdated="2026-09-15",
    ),
    Project(
        id="nh-27-ayodhya", index=5, name="NH-27 Gorakhpur–Ayodhya Link — Section B",
        sector="National Highway", state="Uttar Pradesh", district="Ayodhya",
        lat=26.7922, lng=82.1998, currentStage="3H", areaHectares=155.2,
        affectedFamilies=276, rrProgress=61, compensationReady=68,
        riskLevel="High", riskProbability=64, delayMinDays=47, delayMaxDays=140,
        topRiskFactors=[
            RiskFactor(label="3H stage is at 9.5x its expected duration."),
            RiskFactor(label="Earlier stages averaged 45 days each."),
            RiskFactor(label="1 unresolved legal dispute."),
            RiskFactor(label="Compensation deposited for 68% of affected families."),
        ],
        recommendedActions=[
            RecommendedAction(action="Expedite pending compensation deposits", owner="Competent Authority (LA)"),
            RecommendedAction(action="Audit the disbursal backlog at the treasury", owner="District Collector"),
            RecommendedAction(action="Confirm bank account verification for remaining families", owner="Nodal officer"),
        ],
        modelVersion="logistic_regression_v1",
        stageHistory=[
            StageHistoryEntry(stage="3A", enteredOn="2024-09-11", expectedDays=30, actualDays=34),
            StageHistoryEntry(stage="3C", enteredOn="2024-10-15", expectedDays=45, actualDays=49),
            StageHistoryEntry(stage="3D", enteredOn="2024-12-03", expectedDays=40, actualDays=44),
            StageHistoryEntry(stage="3G", enteredOn="2025-01-16", expectedDays=60, actualDays=58),
            StageHistoryEntry(stage="3H", enteredOn="2025-03-15", expectedDays=35, actualDays=None),
        ],
        alerts=[Alert(id="a4", severity="High", message="Compensation deposit stage far exceeds expected duration.", raisedOn="2026-09-08")],
        photos=[Photo(caption="Section B right-of-way, near Ayodhya bypass")],
        lastUpdated="2026-09-14",
    ),
    Project(
        id="nh-16-vijayawada", index=4, name="NH-16 Vijayawada Eastern Bypass",
        sector="National Highway", state="Andhra Pradesh", district="Vijayawada",
        lat=16.5062, lng=80.648, currentStage="3C", areaHectares=67.8,
        affectedFamilies=98, rrProgress=72, compensationReady=60,
        riskLevel="High", riskProbability=50, delayMinDays=34, delayMaxDays=53,
        topRiskFactors=[
            RiskFactor(label="Earlier stages averaged 45 days each."),
            RiskFactor(label="Currently at stage 3C."),
            RiskFactor(label="1 anticipated dispute over valuation."),
        ],
        recommendedActions=[
            RecommendedAction(action="Hold the objection hearing within the statutory window", owner="District Collector"),
            RecommendedAction(action="Pre-clear the valuation dispute with an independent survey", owner="Competent Authority (LA)"),
        ],
        modelVersion="logistic_regression_v1",
        stageHistory=[
            StageHistoryEntry(stage="3A", enteredOn="2025-05-02", expectedDays=30, actualDays=31),
            StageHistoryEntry(stage="3C", enteredOn="2025-06-02", expectedDays=45, actualDays=None),
        ],
        alerts=[],
        photos=[Photo(caption="Eastern bypass alignment, Vijayawada")],
        lastUpdated="2026-09-11",
    ),
    Project(
        id="nh-19-varanasi", index=6, name="NH-19 Varanasi Ring Road — Phase 2",
        sector="National Highway", state="Uttar Pradesh", district="Varanasi",
        lat=25.3176, lng=82.9739, currentStage="3A", areaHectares=88.4,
        affectedFamilies=120, rrProgress=12, compensationReady=5,
        riskLevel="Low", riskProbability=18, delayMinDays=6, delayMaxDays=22,
        topRiskFactors=[
            RiskFactor(label="No characteristic stands out as elevated versus the portfolio average."),
            RiskFactor(label="Notification of intent filed on schedule."),
        ],
        recommendedActions=[RecommendedAction(action="Continue routine monitoring — no intervention required", owner="Nodal officer")],
        modelVersion="logistic_regression_v1",
        stageHistory=[StageHistoryEntry(stage="3A", enteredOn="2026-08-20", expectedDays=30, actualDays=None)],
        alerts=[],
        photos=[Photo(caption="Ring road Phase 2 proposed alignment")],
        lastUpdated="2026-09-05",
    ),
    Project(
        id="proposed-prayagraj", index=2, name="Proposed Site — Prayagraj Vicinity",
        sector="National Highway", state="Uttar Pradesh", district="Prayagraj",
        lat=25.397, lng=82.9786, currentStage="3A", areaHectares=45,
        affectedFamilies=60, rrProgress=0, compensationReady=0,
        riskLevel="Low", riskProbability=22, delayMinDays=8, delayMaxDays=25,
        topRiskFactors=[RiskFactor(label="Assessed prior to notification — no acquisition activity on record yet.")],
        recommendedActions=[RecommendedAction(action="Revisit once the notification of intent is filed", owner="Nodal officer")],
        modelVersion="logistic_regression_v1",
        stageHistory=[StageHistoryEntry(stage="3A", enteredOn="2026-09-01", expectedDays=30, actualDays=None)],
        alerts=[],
        photos=[],
        lastUpdated="2026-09-01",
    ),
]

PROJECTS_BY_ID: dict[str, Project] = {p.id: p for p in PROJECTS}

STAGE_SEQUENCE: list[StageCode] = ["3A", "3C", "3D", "3G", "3H", "3E"]


def stage_index(code: StageCode) -> int:
    return STAGE_SEQUENCE.index(code)


def clamp(n: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, n))


def risk_from_probability(p: float) -> RiskLevel:
    if p >= 85:
        return "Critical"
    if p >= 60:
        return "High"
    if p >= 30:
        return "Medium"
    return "Low"


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="YugBhoomi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "yugbhoomi-api"}


@app.get("/api/projects", response_model=list[Project])
def list_projects():
    return PROJECTS


@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: str):
    project = PROJECTS_BY_ID.get(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.get("/api/dashboard", response_model=DashboardStats)
def get_dashboard():
    risk_distribution: dict[RiskLevel, int] = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    land = 0.0
    families = 0
    rr_sum = 0
    needing_attention = 0

    for p in PROJECTS:
        risk_distribution[p.riskLevel] += 1
        land += p.areaHectares
        families += p.affectedFamilies
        rr_sum += p.rrProgress
        if p.riskLevel in ("High", "Critical"):
            needing_attention += 1

    return DashboardStats(
        projectsMonitored=len(PROJECTS),
        landUnderAcquisitionHa=round(land, 1),
        familiesAffected=families,
        meanRrProgress=round(rr_sum / len(PROJECTS)) if PROJECTS else 0,
        needingAttention=needing_attention,
        riskDistribution=risk_distribution,
    )


@app.post("/api/assess", response_model=AssessSiteResult)
def assess_site(input: AssessSiteInput):
    families = input.affectedFamilies if input.affectedFamilies is not None else 150
    disputes = input.anticipatedDisputes if input.anticipatedDisputes is not None else 2
    compensation_ready = clamp(input.compensationReady if input.compensationReady is not None else 40, 0, 100)
    rr_progress = clamp(input.rrProgress if input.rrProgress is not None else 45, 0, 100)
    area = input.areaHectares if input.areaHectares is not None else 80
    stage_start = stage_index(input.startingStage)

    score = 20.0
    score += min(disputes, 8) * 6.5
    score += 18 if families > 400 else 11 if families > 200 else 5 if families > 80 else 0
    score += 10 if area > 200 else 5 if area > 100 else 0
    score += (100 - compensation_ready) * 0.18
    score += (50 - rr_progress) * 0.5 if rr_progress < 50 else 0
    score += 6 if stage_start <= 1 else 0
    score = clamp(round(score), 3, 99)

    level = risk_from_probability(score)

    factors: list[RiskFactor] = []
    if disputes >= 3:
        factors.append(RiskFactor(label=f"{disputes} anticipated disputes flagged for this site."))
    if families > 200:
        factors.append(RiskFactor(label=f"{families} families would be displaced — above the portfolio median."))
    if compensation_ready < 50:
        factors.append(RiskFactor(label=f"Only {compensation_ready:g}% of compensation cases assumed ready at the outset."))
    if rr_progress < 50:
        factors.append(RiskFactor(label=f"Rehabilitation progress of {rr_progress:g}% is below the 50% threshold that blocks possession."))
    if area > 150:
        factors.append(RiskFactor(label=f"{area:g} ha is a large acquisition footprint, which historically extends every stage."))
    if not factors:
        factors.append(RiskFactor(label="No characteristic stands out as elevated versus the portfolio average."))

    actions = [
        RecommendedAction(action="Verify title and valuation records before filing the notification.", owner="Competent Authority (LA)"),
        RecommendedAction(action="Pre-clear likely objections with a local consultation.", owner="District Collector"),
        RecommendedAction(action="Line up rehabilitation packages ahead of the award.", owner="R&R administrator"),
    ]

    delay_spread = round(20 + score * 3.2)

    return AssessSiteResult(
        riskLevel=level,
        riskProbability=int(score),
        delayMinDays=max(10, round(delay_spread * 0.4)),
        delayMaxDays=delay_spread,
        topRiskFactors=factors[:4],
        recommendedActions=actions,
        modelVersion="heuristic-fallback-v1",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
