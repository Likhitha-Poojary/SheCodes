import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("citymind_admin_session")?.value;
  const resolvedParams = await params;
  const taskId = resolvedParams.id;
  const districtId = request.nextUrl.searchParams.get("district_id") || "250";

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/grievances/${taskId}?district_id=${districtId}`, {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("citymind_admin_session")?.value;
  const resolvedParams = await params;
  const taskId = resolvedParams.id;
  
  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const body = await request.json();
    const districtId = body.district_id || "250";

    let endpoint = `${BACKEND_URL}/api/v1/grievances/${taskId}/status?district_id=${districtId}`;
    let method = "PATCH";

    // If reassigning officer
    if (body.assigned_officer_id) {
       endpoint = `${BACKEND_URL}/api/v1/grievances/${taskId}/assign?district_id=${districtId}`;
       method = "POST";
    }

    const resp = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
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
