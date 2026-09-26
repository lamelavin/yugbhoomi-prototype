import { StageCode, StageMeta } from "./types";

export const STAGE_SEQUENCE: StageCode[] = ["3A", "3C", "3D", "3G", "3H", "3E"];

export const STAGES: Record<StageCode, StageMeta> = {
  "3A": {
    code: "3A",
    label: "Notification of intent",
    description: "Preliminary notification of the intent to acquire is published for the corridor.",
  },
  "3C": {
    code: "3C",
    label: "Objections heard",
    description: "Objections from affected landholders are recorded and heard by the competent authority.",
  },
  "3D": {
    code: "3D",
    label: "Declaration \u2014 land vests",
    description: "Final declaration is issued and the land vests in the government, free of encumbrances.",
  },
  "3G": {
    code: "3G",
    label: "Compensation determined",
    description: "The competent authority determines the compensation payable to each affected family.",
  },
  "3H": {
    code: "3H",
    label: "Compensation deposited",
    description: "Determined compensation is deposited and disbursed to affected families.",
  },
  "3E": {
    code: "3E",
    label: "Possession taken",
    description: "Physical possession of the acquired land is handed over for construction.",
  },
};

export const EXPECTED_STAGE_DAYS: Record<StageCode, number> = {
  "3A": 30,
  "3C": 45,
  "3D": 40,
  "3G": 60,
  "3H": 35,
  "3E": 20,
};

export function stageIndex(code: StageCode): number {
  return STAGE_SEQUENCE.indexOf(code);
}
