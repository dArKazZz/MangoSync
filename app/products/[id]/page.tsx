import { readDb } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";

interface Params {
  id: string;
}

/**
 * Componente de la página de detalles del producto.
 */
export default async function SingleProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  // Leer directamente de la base de datos local en el servidor
  const db = readDb();
  const product = db.products.find((p) => p.id === id);

  if (!product) return notFound();

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            
            {/* Imagen del Producto */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
              <Image
                src={product.image || "/placeholder/400x400.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Detalles del Producto */}
            <div className="flex flex-col space-y-6 justify-center">
              <div>
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider mb-2">
                  {product.category}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                  {product.name}
                </h1>
              </div>

              <p className="text-2xl text-slate-900 font-extrabold">
                S/. {product.price.toFixed(2)}
              </p>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                  Descripción
                </h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="pt-4">
                <AddToCartButton product={product} className="w-full sm:w-auto px-10 py-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
