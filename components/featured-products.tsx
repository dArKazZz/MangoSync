"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import ProductCard from "./product-card";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos destacados:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight text-center md:text-left">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
