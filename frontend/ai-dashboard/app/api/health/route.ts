import { NextRequest, NextResponse } from "next/server";
import { getDemoAIModels, getDemoDuplicates } from "../../../utils/demoData";

export async function GET(request: NextRequest) {
  try {
    const models = getDemoAIModels();
    const duplicates = getDemoDuplicates();

    return NextResponse.json({
      status: "success",
      data: {
        models,
        duplicates
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: { detail: error.message } },
      { status: 500 }
    );
  }
}
