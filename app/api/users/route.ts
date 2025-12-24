import { NextResponse } from "next/server";

import { fetchUsers } from "@/lib/services/userService";

export async function GET() {
  try {
    const data = await fetchUsers();

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
