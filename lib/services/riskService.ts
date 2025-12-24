import { User } from "@/types/api";

interface BloodPressure {
  systolic: number | null;
  diastolic: number | null;
  valid: boolean;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.trim());

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseBloodPressure(value: string | null | undefined): BloodPressure {
  if (typeof value !== "string") {
    return { systolic: null, diastolic: null, valid: false };
  }
  const [systolicRaw, diastolicRaw] = value.split("/");

  const systolic = parseNumber(systolicRaw);
  const diastolic = parseNumber(diastolicRaw);

  const valid = systolic !== null && diastolic !== null;

  return { systolic, diastolic, valid };
}

function scoreBloodPressure(bp: BloodPressure): { score: number; valid: boolean } {
  if (!bp.valid || bp.systolic === null || bp.diastolic === null) {
    return { score: 0, valid: false };
  }

  const { systolic, diastolic } = bp;

  if (systolic < 120 && diastolic < 80) {
    return { score: 0, valid: true };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return { score: 1, valid: true };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { score: 2, valid: true };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return { score: 3, valid: true };
  }

  return { score: 0, valid: true };
}

function scoreTemperature(value: number | string | null | undefined): { score: number; valid: boolean; } {
  const numeric = parseNumber(value);
  if (numeric === null) {
    return { score: 0, valid: false };
  }

  if (numeric <= 99.5) {
    return { score: 0, valid: true };
  }

  if (numeric >= 99.6 && numeric <= 100.9) {
    return { score: 1, valid: true };
  }

  if (numeric >= 101.0) {
    return { score: 2, valid: true };
  }

  return { score: 0, valid: true };
}

function scoreAge(value: number | string | null | undefined): { score: number; valid: boolean } {
  const numeric = parseNumber(value);
  if (numeric === null) {
    return { score: 0, valid: false };
  }

  if (numeric < 40) {
    return { score: 0, valid: true };
  }

  if (numeric >= 40 && numeric <= 65) {
    return { score: 1, valid: true };
  }

  if (numeric > 65) {
    return { score: 2, valid: true };
  }

  return { score: 0, valid: true };
}

function getPatientId(user: User): string | null {
  if (typeof user.patient_id === "string" && user.patient_id.length > 0) {
    return user.patient_id;
  }

  return null;
}

export function getHighRiskPatients(users: User[]): string[] {
  const results: string[] = [];

  for (const user of users) {
    const patientId = getPatientId(user);
    if (!patientId) {
      continue;
    }

    const bpScore = scoreBloodPressure(parseBloodPressure(user.blood_pressure || null));
    const tempScore = scoreTemperature(user.temperature || null);
    const ageScore = scoreAge(user.age || null);
    const totalScore = bpScore.score + tempScore.score + ageScore.score;

    if (totalScore >= 4) {
      results.push(patientId);
    }
  }

  return results;
}

export function getFeverPatients(users: User[]): string[] {
  const results: string[] = [];

  for (const user of users) {
    const patientId = getPatientId(user);
    if (!patientId) {
      continue;
    }

    const tempScore = scoreTemperature(user.temperature || null);
    if (tempScore.valid && tempScore.score > 0) {
      results.push(patientId);
    }
  }

  return results;
}

export function getDataQualityIssues(users: User[]): string[] {
  const results: string[] = [];

  for (const user of users) {
    const patientId = getPatientId(user);
    if (!patientId) {
      continue;
    }

    const bpScore = scoreBloodPressure(parseBloodPressure(user.blood_pressure || null));
    const tempScore = scoreTemperature(user.temperature || null);
    const ageScore = scoreAge(user.age || null);

    if (!bpScore.valid || !tempScore.valid || !ageScore.valid) {
      results.push(patientId);
    }
  }

  return results;
}
