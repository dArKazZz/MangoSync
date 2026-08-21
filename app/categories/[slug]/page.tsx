import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { readDb } from "@/lib/db";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Leer directamente de la base de datos local en el servidor
  const db = readDb();
  const category = db.categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = db.products.filter((p) => p.category === category.name);

  return (
    <>
      <Navbar />
      <section className="w-full py-12 min-h-screen bg-slate-50/50">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">{category.name}</h1>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border shadow-xs">
              <h2 className="text-lg font-bold text-slate-600">
                No se encontraron productos en esta categoría
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CategoryPage;
