"use client";

import React, { useEffect, useState } from "react";
import { getAllProducers } from "@/lib/data";
import { Producer } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ShieldCheck, Award } from "lucide-react";

export default function FeaturedProducers() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducers()
      .then((data) => {
        setProducers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productores:", err);
        setLoading(false);
      });
  }, []);

  // Función para obtener las clases de color del nivel
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
      <section className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-slate-50/50">
      <div className="container mx-auto px-4 md:py-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Comercio Justo
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Nuestros Productores de Mango Kent
          </h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Compra directamente a los agricultores de Motupe, Olmos y distritos del norte. Conoce sus fincas, reputación fitosanitaria y niveles de comercialización.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {producers.map((producer) => (
            <Card key={producer.id} className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col h-full bg-white group">
              {/* Foto de Portada / Campo */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={producer.bannerImage}
                  alt={`Finca de ${producer.name}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Sello SENASA */}
                {producer.senasaCertified && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs z-10">
                    <ShieldCheck className="h-3.5 w-3.5 fill-white/10" /> SENASA
                  </span>
                )}
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  
                  {/* Foto de Perfil Flotante y Nombre */}
                  <div className="flex items-start gap-3 -mt-10 mb-3 relative z-10">
                    <div className="relative h-14 w-14 rounded-2xl border-4 border-white overflow-hidden shadow-xs bg-slate-200">
                      <img
                        src={producer.image}
                        alt={producer.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-8">
                      <h3 className="font-extrabold text-slate-800 text-sm leading-tight hover:text-emerald-700 transition-colors">
                        <Link href={`/productores/${producer.id}`}>{producer.name}</Link>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-amber-500" /> {producer.district}, Perú
                      </p>
                    </div>
                  </div>

                  {/* Nivel de Gamificación */}
                  <div className="flex items-center justify-between mb-3.5 mt-2">
                    <span className="text-slate-400 text-xs font-semibold">Nivel:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${getLevelColorClass(producer.level)}`}>
                      <span>{producer.emoji}</span>
                      <span>{producer.level}</span>
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                    {producer.description}
                  </p>

                </div>

                <div className="border-t pt-4">
                  {/* Reputación y Enlace */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-slate-800">{producer.rating}</span>
                      <span className="text-[10px] text-slate-400">({producer.reviewsCount} reseñas)</span>
                    </div>

                    <Button 
                      asChild 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3.5 cursor-pointer"
                    >
                      <Link href={`/productores/${producer.id}`}>Ver Tienda</Link>
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
