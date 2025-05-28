import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Test endpoint working" });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "GET test endpoint working" });
}
