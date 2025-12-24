import { NextResponse } from "next/server";

import { fetchUsers } from "@/lib/services/userService";
import {
  getDataQualityIssues,
  getFeverPatients,
  getHighRiskPatients,
} from "@/lib/services/riskService";

export async function GET() {
  try {
    const users = await fetchUsers();

    const highRiskPatients = getHighRiskPatients(users);
    const feverPatients = getFeverPatients(users);
    const dataQualityIssues = getDataQualityIssues(users);

    return NextResponse.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
