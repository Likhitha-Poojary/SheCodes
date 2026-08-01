import { NextRequest, NextResponse } from "next/server";
import { getDemoPredictions } from "../../../lib/utils/demoData";

export async function GET(request: NextRequest) {
  try {
    const predictions = getDemoPredictions();
    return NextResponse.json({
      status: "success",
      data: { predictions }
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: { detail: error.message } },
      { status: 500 }
    );
  }
}
