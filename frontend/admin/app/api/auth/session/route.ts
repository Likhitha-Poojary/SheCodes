import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-karnataka-citymind-key-18273";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("citymind_admin_session")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", error: { detail: "Session token not found." } },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // RBAC Security validation: Only supervisor and administrator roles
    const adminRoles = ["SUPER_ADMIN", "DISTRICT_COMMISSIONER", "DEPARTMENT_HEAD", "WARD_SUPERVISOR", "FIELD_SUPERVISOR"];
    if (!adminRoles.includes(payload.role)) {
      return NextResponse.json(
        { status: "error", error: { detail: "Forbidden: Access restricted to command personnel." } },
        { status: 403 }
      );
    }

    const user = {
      id: payload.sub,
      username: payload.preferred_username,
      role: payload.role,
      district_id: payload.district_id,
      department_id: payload.department_id
    };

    return NextResponse.json({ status: "success", data: { user } });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", error: { detail: "Invalid token or expired session." } },
      { status: 401 }
    );
  }
}
