export interface User {
  patient_id?: string | undefined;
  blood_pressure?: string | null | undefined;
  temperature?: number | string | null | undefined;
  age?: number | string | null | undefined;
  [key: string]: unknown;
}
