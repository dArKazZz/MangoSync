"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import { getAllProducts } from "@/lib/data";
import { Product } from "@/lib/types";

function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
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
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Todos los Productos</h1>

        {allProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl text-slate-500 bg-white">
            No hay productos o ofertas disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;