import { readDb } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";
import Link from "next/link";
import { Star, MapPin, ShieldCheck, Award } from "lucide-react";

interface Params {
  id: string;
}

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

  // Buscar productor del producto actual
  const currentProducer = db.producers.find(p => p.id === product.producerId);

  // Buscar todas las ofertas competitivas (mismo nombre de producto)
  const competingOffers = db.products.filter(p => p.name === product.name);

  // Helper para obtener datos del productor por ID
  const getProducerData = (producerId: string) => {
    return db.producers.find(p => p.id === producerId);
  };

  const getLevelColorClass = (level: string) => {
    switch (level) {
      case "Semilla": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Productor": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Avanzado": return "bg-teal-50 text-teal-700 border-teal-200";
      case "Premium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Élite": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8 space-y-8">
          
          {/* Ficha Principal del Producto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            
            {/* Imagen del Producto */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src={product.image || "/placeholder/400x400.svg"}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
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
                
                {/* Agricultor Propietario de la oferta actual */}
                {currentProducer && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <span>Vendedor:</span>
                    <Link 
                      href={`/productores/${currentProducer.id}`}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      {currentProducer.name}
                    </Link>
                    <span className="flex items-center text-amber-500 font-bold ml-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-0.5" />
                      {currentProducer.rating}
                    </span>
                  </div>
                )}
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
                <AddToCartButton product={product} className="w-full sm:w-auto px-10 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl" />
              </div>
            </div>
          </div>

          {/* --- COMPARADOR DE VENDEDORES Y PRECIOS --- */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-950">Comparativa de Vendedores y Ofertas</h3>
              <p className="text-slate-500 text-xs mt-1">Compara los precios, reputación regional e insignias fitosanitarias de los agricultores locales que ofrecen "{product.name}".</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 min-w-[600px]">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 rounded-2xl">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-bold">Productor / Asociación</th>
                    <th scope="col" className="px-6 py-4 font-bold">Zona</th>
                    <th scope="col" className="px-6 py-4 font-bold">Nivel</th>
                    <th scope="col" className="px-6 py-4 font-bold">Reputación</th>
                    <th scope="col" className="px-6 py-4 font-bold">Certificado</th>
                    <th scope="col" className="px-6 py-4 font-bold">Precio Oferta</th>
                    <th scope="col" className="px-6 py-4 text-right font-bold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {competingOffers.map((offer) => {
                    const offerProducer = getProducerData(offer.producerId);
                    if (!offerProducer) return null;
                    const isCurrentOffer = offer.id === product.id;

                    return (
                      <tr 
                        key={offer.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${isCurrentOffer ? "bg-emerald-50/20" : ""}`}
                      >
                        {/* Nombre Productor */}
                        <td className="px-6 py-4.5 font-bold text-slate-800">
                          <Link 
                            href={`/productores/${offerProducer.id}`}
                            className="hover:text-emerald-700 hover:underline flex items-center gap-2"
                          >
                            <div className="relative h-7 w-7 rounded-lg overflow-hidden bg-slate-100">
                              <img 
                                src={offerProducer.image} 
                                alt={offerProducer.name} 
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                            <span>{offerProducer.name}</span>
                            {isCurrentOffer && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1.5">
                                Viendo
                              </span>
                            )}
                          </Link>
                        </td>

                        {/* Zona */}
                        <td className="px-6 py-4.5">
                          <span className="flex items-center gap-0.5 text-xs font-semibold text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-amber-500" /> {offerProducer.district}
                          </span>
                        </td>

                        {/* Nivel */}
                        <td className="px-6 py-4.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-0.5 ${getLevelColorClass(offerProducer.level)}`}>
                            <span>{offerProducer.emoji}</span>
                            <span>{offerProducer.level}</span>
                          </span>
                        </td>

                        {/* Reputación */}
                        <td className="px-6 py-4.5">
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            {offerProducer.rating} <span className="text-[10px] text-slate-400 font-normal">({offerProducer.reviewsCount})</span>
                          </span>
                        </td>

                        {/* SENASA */}
                        <td className="px-6 py-4.5">
                          {offerProducer.senasaCertified ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 shadow-2xs">
                              <ShieldCheck className="h-3 w-3 text-amber-600 fill-amber-500/10" /> SENASA
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Inactivo</span>
                          )}
                        </td>

                        {/* Precio */}
                        <td className="px-6 py-4.5">
                          <span className="text-slate-900 font-extrabold text-base">S/. {offer.price.toFixed(2)}</span>
                        </td>

                        {/* Agregar al carrito */}
                        <td className="px-6 py-4.5 text-right">
                          <AddToCartButton 
                            product={offer} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs py-2 px-4 h-9 cursor-pointer" 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
