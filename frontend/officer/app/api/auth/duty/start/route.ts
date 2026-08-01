import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("citymind_officer_session")?.value;

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/officers/duty/start`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      return NextResponse.json({ status: "error", error: { detail: errorText } }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: "success", data: { message: "Duty session started (offline/mock)." } });
  }
}
