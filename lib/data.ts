import { Product, Category } from "./types";

/**
 * Retrieves all products asynchronously from the API route.
 * @returns {Promise<Product[]>} An array of all product objects.
 */
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
}

/**
 * Retrieves the first 4 products from the API.
 * @returns {Promise<Product[]>} An array of the first 4 product objects.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.slice(0, 4);
}

/**
 * Retrieves all categories from the API.
 * @returns {Promise<Category[]>} An array of all category objects.
 */
export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}