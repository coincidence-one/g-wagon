import { NextResponse } from "next/server";
import { fetchMNDMarts } from "@/lib/api/mnd";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start") || "1";
  const end = searchParams.get("end") || "1000"; // Fetch a large chunk by default

  try {
    const data = await fetchMNDMarts(Number(start), Number(end));
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
