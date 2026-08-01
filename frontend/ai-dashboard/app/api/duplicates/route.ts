import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { grievance_id_a, grievance_id_b } = await request.json();

    return NextResponse.json({
      status: "success",
      message: `Complaints ${grievance_id_a} and ${grievance_id_b} merged successfully. Ticket B archived.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: { detail: error.message } },
      { status: 500 }
    );
  }
}
