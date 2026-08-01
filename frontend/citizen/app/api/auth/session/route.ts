import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-karnataka-citymind-key-18273";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("citymind_session")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", error: { detail: "Session token not found." } },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = {
      id: payload.sub,
      username: payload.preferred_username,
      role: payload.role,
      district_id: payload.district_id
    };

    return NextResponse.json({ status: "success", data: { user } });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", error: { detail: "Invalid token or expired session." } },
      { status: 401 }
    );
  }
}
