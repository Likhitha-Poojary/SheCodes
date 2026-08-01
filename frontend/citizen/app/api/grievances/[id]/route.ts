import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("citymind_session")?.value;
  const districtId = request.nextUrl.searchParams.get("district_id");
  
  // Resolve dynamic route params promise in Next.js 15
  const resolvedParams = await params;
  const grievanceId = resolvedParams.id;

  if (!token) {
    return NextResponse.json({ status: "error", error: { detail: "Unauthorized." } }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/grievances/${grievanceId}?district_id=${districtId}`, {
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
