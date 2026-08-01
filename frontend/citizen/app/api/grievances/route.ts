import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("citymind_session")?.value;
  const citizenId = request.nextUrl.searchParams.get("citizen_id");

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/citizens/${citizenId}/grievances`, {
      method: "GET",
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
    return NextResponse.json({ status: "error", error: { detail: error.message } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("citymind_session")?.value;
  const idempotencyKey = request.headers.get("Idempotency-Key");

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const body = await request.json();
    const resp = await fetch(`${BACKEND_URL}/api/v1/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Idempotency-Key": idempotencyKey || ""
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      return NextResponse.json({ status: "error", error: { detail: errorText } }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: { detail: error.message } }, { status: 500 });
  }
}
