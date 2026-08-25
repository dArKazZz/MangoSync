import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ producers: db.producers });
  } catch (error) {
    console.error("Error reading producers:", error);
    return NextResponse.json({ error: "Failed to read producers" }, { status: 500 });
  }
}
