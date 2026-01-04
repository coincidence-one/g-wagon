import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), "src/data/marts.json");

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, count: data.length });
  } catch (error) {
    console.error("Failed to save file:", error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
