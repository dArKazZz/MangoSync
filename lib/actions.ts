"use server";

import { readDb, writeDb } from "./db";
import { Product, Category } from "./types";
import { revalidatePath } from "next/cache";

export async function getProducts(): Promise<Product[]> {
  const db = readDb();
  return db.products;
}

export async function getCategories(): Promise<Category[]> {
  const db = readDb();
  return db.categories;
}

export async function createProduct(productData: Omit<Product, "id">): Promise<Product> {
  const db = readDb();
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
  };
  db.products.push(newProduct);
  writeDb(db);
  
  // Revalidar rutas para reflejar los cambios en caliente
  const categorySlug = productData.category.toLowerCase().replace(/\s+/g, "-");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/categories/${categorySlug}`);
  revalidatePath("/profile");
  
  return newProduct;
}

export async function updateProduct(
  id: string,
  updatedFields: Partial<Omit<Product, "id">>
): Promise<Product> {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Producto no encontrado");
  }

  const updatedProduct = {
    ...db.products[index],
    ...updatedFields,
  };

  db.products[index] = updatedProduct;
  writeDb(db);

  const categorySlug = updatedProduct.category.toLowerCase().replace(/\s+/g, "-");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath(`/categories/${categorySlug}`);
  revalidatePath("/profile");

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = readDb();
  const product = db.products.find((p) => p.id === id);
  if (!product) return;

  db.products = db.products.filter((p) => p.id !== id);
  writeDb(db);

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, "-");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/categories/${categorySlug}`);
  revalidatePath("/profile");
}
