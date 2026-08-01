import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("citymind_admin_session")?.value;
  const role = request.nextUrl.searchParams.get("role");
  const filterId = request.nextUrl.searchParams.get("filter_id");

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    // Map district queries based on admin mappings
    let endpoint = `${BACKEND_URL}/api/v1/districts/250/grievances`;
    if (role === "SUPER_ADMIN" || role === "DEPARTMENT_HEAD") {
      endpoint = `${BACKEND_URL}/api/v1/districts/250/grievances`;
    } else if (filterId) {
      endpoint = `${BACKEND_URL}/api/v1/districts/${filterId}/grievances`;
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
export type int = number;
