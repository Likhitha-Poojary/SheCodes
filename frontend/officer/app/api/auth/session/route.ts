import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-karnataka-citymind-key-18273";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("citymind_officer_session")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", error: { detail: "Session token not found." } },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // RBAC Security validation
    if (payload.role !== "FIELD_OFFICER" && payload.role !== "SUPERVISOR") {
      return NextResponse.json(
        { status: "error", error: { detail: "Forbidden: Access restricted to field operational roles." } },
        { status: 403 }
      );
    }

    const username = payload.preferred_username || "officer_field";
    const department = payload.department || (
      username.includes("gowda") ? "BWSSB Water Supply Division"
      : username.includes("lakshmi") ? "BESCOM Electrical Operations"
      : username.includes("rameesh") ? "Emergency Response Command"
      : username.includes("suresh") ? "BBMP Sanitation Zone 2"
      : "BBMP Sanitation & Public Health"
    );

    const user = {
      id: payload.sub,
      username: username,
      phone: payload.phone || "9876543210",
      department: department,
      role: payload.role || "FIELD_OFFICER",
      district_id: payload.district_id || 250
    };

    return NextResponse.json({ status: "success", data: { user } });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", error: { detail: "Invalid token or expired session." } },
      { status: 401 }
    );
  }
}
