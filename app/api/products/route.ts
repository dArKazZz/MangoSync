import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ products: db.products });
  } catch (error) {
    console.error("Error reading products:", error);
    return NextResponse.json({ error: "Failed to read products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = readDb();
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      description: description || "",
      price: parseFloat(price),
      category,
      image: image || "/images/product_ataulfo_box.png",
    };

    db.products.push(newProduct);
    writeDb(db);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
