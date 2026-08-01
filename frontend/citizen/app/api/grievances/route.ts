import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PRIMARY_BACKEND = process.env.BACKEND_URL || "http://localhost:8085";
const SECONDARY_BACKEND = "http://127.0.0.1:8080";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-karnataka-citymind-key-18273";

async function safeFetchBackend(path: string, options: RequestInit) {
  try {
    const resp = await fetch(`${PRIMARY_BACKEND}${path}`, options);
    if (resp.ok) return resp;
  } catch (e) {
    // Try secondary backend
  }
  return await fetch(`${SECONDARY_BACKEND}${path}`, options);
}

export async function GET(request: NextRequest) {
  let token = request.cookies.get("citymind_session")?.value;
  const citizenId = request.nextUrl.searchParams.get("citizen_id") || "9c8dfb2c-63b1-419b-a010-09ab02c1d9b3";

  if (!token) {
    token = jwt.sign(
      { sub: citizenId, preferred_username: "Citizen User", role: "CITIZEN", district_id: 250 },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  try {
    const resp = await safeFetchBackend("/complaints", {
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
  let token = request.cookies.get("citymind_session")?.value;
  const idempotencyKey = request.headers.get("Idempotency-Key");

  if (!token) {
    token = jwt.sign(
      { sub: "9c8dfb2c-63b1-419b-a010-09ab02c1d9b3", preferred_username: "Citizen User", role: "CITIZEN", district_id: 250 },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  try {
    const body = await request.json();
    const resp = await safeFetchBackend("/complaints", {
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
