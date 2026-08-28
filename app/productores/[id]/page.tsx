"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getProducerById, getAllProducts } from "@/lib/data";
import { Producer, Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Calendar, 
  FileText, 
  Heart, 
  MessageSquare, 
  ShoppingBag, 
  Info, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ProducerStorefrontPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("muro"); // "muro" | "catalogo" | "resenas"
  
  // Likes locales de los posts
  const [postLikes, setPostLikes] = useState<{ [key: string]: number }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    Promise.all([getProducerById(id), getAllProducts()])
      .then(([prodData, allProds]) => {
        if (prodData) {
          setProducer(prodData);
          // Filtrar productos de este productor
          const filtered = allProds.filter(p => p.producerId === prodData.id);
          setProducts(filtered);

          // Inicializar likes
          const initialLikes: { [key: string]: number } = {};
          prodData.posts.forEach(post => {
            initialLikes[post.id] = post.likes;
          });
          setPostLikes(initialLikes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar perfil de productor:", err);
        setLoading(false);
      });
  }, [id]);

  const handleLike = (postId: string) => {
    if (likedPosts[postId]) {
      setPostLikes(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      setLikedPosts(prev => ({ ...prev, [postId]: false }));
    } else {
      setPostLikes(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      setLikedPosts(prev => ({ ...prev, [postId]: true }));
    }
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

  if (loading) {
    return (
      <section className="w-full min-h-screen py-20 flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </section>
    );
  }

  if (!producer) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-20 flex flex-col items-center justify-center text-center bg-slate-50 px-4">
          <AlertCircle className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-extrabold text-slate-900">Productor No Encontrado</h1>
          <p className="text-slate-500 text-sm mt-2">El productor que estás buscando no existe o fue desvinculado.</p>
          <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
            <Link href="/">Volver a Inicio</Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-20">
        
        {/* --- BANNER DE PORTADA DE LA FINCA --- */}
        <div className="relative h-[250px] sm:h-[320px] w-full overflow-hidden bg-slate-900">
          <Image
            src={producer.bannerImage}
            alt={`Chacra de ${producer.name}`}
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
          
          {/* Botón de Retorno */}
          <Link 
            href="/"
            className="absolute top-6 left-6 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 h-9 w-9 rounded-xl flex items-center justify-center transition-colors shadow-xs z-10 cursor-pointer"
            title="Volver a Inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* --- SECCIÓN DE ENCABEZADO DE PERFIL --- */}
        <div className="container mx-auto px-4 md:px-8 relative -mt-16 sm:-mt-24 z-20 mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Foto de Perfil */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-4 border-white overflow-hidden shadow-md bg-slate-200 flex-shrink-0">
                <Image
                  src={producer.image}
                  alt={producer.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Título y Badges */}
              <div className="space-y-1.5 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">{producer.name}</h1>
                  {producer.senasaCertified && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="h-4 w-4 text-amber-600 fill-amber-500/10" /> SENASA
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-500 font-semibold flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-amber-500" /> {producer.district}, Perú
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${getLevelColorClass(producer.level)}`}>
                    <span>{producer.emoji}</span>
                    <span>Nivel {producer.level}</span>
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">|</span>
                  <span className="text-slate-500 text-xs font-semibold">Socio desde: {producer.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* KPIs Rápidos del Vendedor */}
            <div className="flex gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <div className="text-center md:text-right">
                <p className="text-slate-400 text-xs font-semibold">Reputación B2B</p>
                <div className="flex items-center gap-1 mt-1 justify-center md:justify-end">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="text-lg font-black text-slate-900">{producer.rating}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{producer.reviewsCount} transacciones</p>
              </div>

              <div className="h-10 w-[1px] bg-slate-200 self-center" />

              <div className="text-center md:text-right">
                <p className="text-slate-400 text-xs font-semibold">Volumen Histórico</p>
                <p className="text-emerald-700 font-black text-xl mt-0.5">{(producer.cajasVendidas).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">cajas despachadas</p>
              </div>
            </div>

          </div>
        </div>

        {/* --- GRID DE CONTENIDO PRINCIPAL --- */}
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- COLUMNA IZQUIERDA (DATOS DE LA FINCA Y GALERÍA) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tarjeta de Ficha Técnica */}
            <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-slate-900 text-white p-5">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-400" />
                  Ficha Técnica de la Finca
                </h3>
              </div>
              <CardContent className="p-5 space-y-4 text-sm">
                
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-slate-400 font-semibold">Nombre de Finca:</span>
                  <span className="text-slate-800 font-bold text-right">{producer.chacraName}</span>
                </div>

                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-slate-400 font-semibold">Sistema de Riego:</span>
                  <span className="text-slate-800 font-bold text-right">{producer.irrigationSystem}</span>
                </div>

                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-slate-400 font-semibold">Tipo de Suelo:</span>
                  <span className="text-slate-800 font-bold text-right max-w-[200px]">{producer.soilType}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-400 font-semibold">Edad de Árboles:</span>
                  <span className="text-slate-800 font-bold text-right">{producer.treeAge}</span>
                </div>

              </CardContent>
            </Card>

            {/* Tarjeta de Galería Fotográfica */}
            <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-slate-900 text-white p-5">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Image src="/images/logo_emblem.png" alt="" width={16} height={16} className="object-contain" />
                  Galería de Cultivos
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {producer.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative h-28 rounded-2xl overflow-hidden bg-slate-100 border">
                      <Image
                        src={imgUrl}
                        alt={`Lote de producción ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* --- COLUMNA DERECHA (PANELES INTERACTIVOS Y TIENDA) --- */}
          <div className="lg:col-span-8 space-y-6">
            

            {/* Navegación de Pestañas del Perfil */}
            <div className="bg-white p-2 rounded-2xl shadow-2xs border flex gap-2">
              <button
                onClick={() => setActiveTab("muro")}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === "muro" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Muro de Novedades
              </button>
              
              <button
                onClick={() => setActiveTab("catalogo")}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === "catalogo" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Catálogo de Tienda ({products.length})
              </button>

              <button
                onClick={() => setActiveTab("resenas")}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === "resenas" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Reseñas de Compradores
              </button>
            </div>

            {/* --- CONTENIDO TABS --- */}

            {/* A. TAB MURO SOCIAL */}
            {activeTab === "muro" && (
              <div className="space-y-6">
                {producer.posts.map((post) => (
                  <Card key={post.id} className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white p-6">
                    {/* Encabezado Post */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        <Image
                          src={producer.image}
                          alt={producer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{producer.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{post.date}</p>
                      </div>
                    </div>

                    {/* Contenido Post */}
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Footer Post */}
                    <div className="border-t pt-4 flex gap-6 text-slate-500 text-xs">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${likedPosts[post.id] ? "text-rose-600 font-bold" : "hover:text-rose-600"}`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${likedPosts[post.id] ? "fill-rose-600" : ""}`} />
                        <span>{postLikes[post.id]} Me gusta</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4.5 w-4.5" />
                        <span>0 Comentarios</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* B. TAB CATÁLOGO EXCLUSIVO */}
            {activeTab === "catalogo" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-20 border border-dashed rounded-3xl text-slate-400 text-sm">
                    Este agricultor no tiene ofertas activas en este momento.
                  </div>
                )}
              </div>
            )}

            {/* C. TAB RESEÑAS Y REPUTACIÓN */}
            {activeTab === "resenas" && (
              <div className="space-y-4">
                {/* Reseña 1 */}
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-sm">Negociación Frutera del Norte</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">Comprador Exportador (Planta Olmos)</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    "Excelente trato comercial. Cumplió con el volumen acordado de Mango Kent en el incoterm FOB-Planta. Fruta con calibre correcto y excelente maduración."
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">Fecha: 15 Jul 2026</p>
                </Card>

                {/* Reseña 2 */}
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-sm">Distribuidora Lambayeque S.A.</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">Comprador Nacional (EXW-Chacra)</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    "Don Felipe tiene una de las mejores producciones de Motupe. Retiramos 200 cajas en finca. Hubo un desfase de 1 día por la cosecha pero la calidad de la fruta compensó todo."
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">Fecha: 02 Jun 2026</p>
                </Card>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
