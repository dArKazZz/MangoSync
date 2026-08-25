import { Product, Category, Producer } from "./types";

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

/**
 * Retrieves all producers from the API.
 * @returns {Promise<Producer[]>} An array of all producer objects.
 */
export async function getAllProducers(): Promise<Producer[]> {
  const res = await fetch("/api/producers", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch producers");
  const data = await res.json();
  return data.producers;
}

/**
 * Retrieves a single producer by ID.
 * @param {string} id The producer's unique ID.
 * @returns {Promise<Producer | undefined>} The producer object, or undefined if not found.
 */
export async function getProducerById(id: string): Promise<Producer | undefined> {
  const producers = await getAllProducers();
  return producers.find(p => p.id === id);
}