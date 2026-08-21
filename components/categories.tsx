"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/data";
import { Category } from "@/lib/types";
import CategoryCard from "./category-card";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
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
    <section className="w-full py-12 bg-slate-50/50">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight text-center md:text-left">Comprar por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;