import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, category, image } = body;

    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = {
      ...db.products[index],
      name: name !== undefined ? name : db.products[index].name,
      description: description !== undefined ? description : db.products[index].description,
      price: price !== undefined ? parseFloat(price) : db.products[index].price,
      category: category !== undefined ? category : db.products[index].category,
      image: image !== undefined ? image : db.products[index].image,
    };

    db.products[index] = updatedProduct;
    writeDb(db);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const product = db.products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    db.products = db.products.filter((p) => p.id !== id);
    writeDb(db);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
