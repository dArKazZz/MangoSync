import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ categories: db.categories });
  } catch (error) {
    console.error("Error reading categories:", error);
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 });
  }
}
