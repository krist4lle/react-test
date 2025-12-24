import { NextResponse } from "next/server";

import { fetchUsers } from "@/lib/services/userService";
import {
  getDataQualityIssues,
  getFeverPatients,
  getHighRiskPatients,
} from "@/lib/services/riskService";
import { submitAssessment } from "@/lib/services/submissionService";

export async function GET() {
  try {
    const users = await fetchUsers();

    const highRiskPatients = getHighRiskPatients(users);
    const feverPatients = getFeverPatients(users);
    const dataQualityIssues = getDataQualityIssues(users);

    const submission = await submitAssessment({
      high_risk_patients: highRiskPatients,
      fever_patients: feverPatients,
      data_quality_issues: dataQualityIssues,
    });

    return NextResponse.json(submission);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
