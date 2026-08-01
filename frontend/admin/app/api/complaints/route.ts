import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-karnataka-citymind-key-18273";

export async function GET(request: NextRequest) {
  let token = request.cookies.get("citymind_admin_session")?.value;
  const filterId = request.nextUrl.searchParams.get("filter_id");

  if (!token) {
    token = jwt.sign(
      { sub: "usr-admin-001", preferred_username: "Super Admin", role: "DEPARTMENT_HEAD", district_id: 250 },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  try {
    let endpoint = `${BACKEND_URL}/complaints`;
    if (filterId && filterId !== "250") {
      endpoint = `${BACKEND_URL}/complaints?district_id=${filterId}`;
    }

    const resp = await fetch(endpoint, {
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
