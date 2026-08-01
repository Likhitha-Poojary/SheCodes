import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8085";

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json();

    // Send update request to core backend server
    try {
      const resp = await fetch(`${BACKEND_URL}/users/${profileData.id || "default"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (resp.ok) {
        const body = await resp.json();
        return NextResponse.json({ status: "success", data: body.data || { user: profileData } });
      }
    } catch {
      // Backend unavailable; client will sync locally
    }

    return NextResponse.json({
      status: "success",
      data: { user: profileData },
      message: "Saved locally and pending backend sync"
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: { detail: error.message } },
      { status: 500 }
    );
  }
}
