import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    status: "success",
    message: "Logged out successfully"
  });

  // Clear cookie by setting maxAge to 0
  response.cookies.set("citymind_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/"
  });

  return response;
}
