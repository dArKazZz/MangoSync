"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, BookOpen, ShieldAlert } from "lucide-react";

export const mockArticles = [
  {
    id: "el-nino-2026",
    title: "Fenómeno de El Niño 2026: Resiliencia Climática y Manejo del Mango Kent en el Norte",
    date: "24 Ago 2026",
    summary: "El calentamiento anómalo del mar y el aumento de temperaturas mínimas impactan severamente la floración del mango Kent en Piura y Lambayeque. Especialistas agrícolas recomiendan podas de ventilación, control riguroso de humedad por goteo y planes preventivos contra la mosca de la fruta.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=800",
    tag: "Clima & Resiliencia",
    featured: true,
    author: "Ing. Agrónoma Lucía Torres"
  },
  {
    id: "motupe-export",
    title: "Exportaciones de Mango Kent en Motupe alcanzan cifra récord de campaña",
    date: "18 Ago 2026",
    summary: "A pesar de las variaciones climatológicas de la temporada, los pequeños agricultores agremiados de Motupe que cuentan con certificación SENASA activa han logrado colocar más de 12,000 toneladas de mango Kent en mercados del exterior.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800",
    tag: "Exportación & Comercio",
    featured: false,
    author: "Redacción MangoSync"
  },
  {
    id: "senasa-normas",
    title: "SENASA endurece controles fitosanitarios frente a mosca de la fruta",
    date: "12 Ago 2026",
    summary: "Con la finalidad de salvaguardar el acceso a mercados internacionales, SENASA ha anunciado inspecciones semanales in situ para los predios de Olmos, Jayanca e Íllimo. Se pide a los productores usar trampas ecológicas preventivas.",
    image: "https://images.unsplash.com/photo-1605000797439-7571d3cc4a21?auto=format&fit=crop&q=80&w=800",
    tag: "Fitosanitario",
    featured: false,
    author: "Prensa Agropecuaria"
  },
  {
    id: "riego-olmos",
    title: "Técnicas de riego localizado en Olmos frente a la escasez hídrica",
    date: "05 Ago 2026",
    summary: "Cooperativas locales en Olmos implementan con éxito sistemas de riego por microgoteo que reducen en un 35% el consumo de agua por hectárea, asegurando calibres estables para la variedad Kent sin desperdiciar recursos.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    tag: "Tecnología de Riego",
    featured: false,
    author: "Ing. Carlos Mendoza"
  }
];

export default function NoticiasPage() {
  const featuredArticle = mockArticles.find(a => a.featured);
  const otherArticles = mockArticles.filter(a => !a.featured);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
        <div className="container mx-auto">
          
          {/* Cabecera de Noticias */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Capacitación e Información
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Portal de Noticias & Resiliencia Agrícola
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Artículos técnicos, novedades de mercado y guías para el cultivo de Mango Kent frente al cambio climático en el norte peruano.
            </p>
          </div>

          {/* --- ARTÍCULO DESTACADO (FENÓMENO DE EL NIÑO) --- */}
          {featuredArticle && (
            <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white mb-12 group hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="relative h-64 sm:h-96 lg:h-auto lg:col-span-7 bg-slate-100">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <ShieldAlert className="h-3.5 w-3.5 fill-white/10" /> Alerta Climática
                  </span>
                </div>
                
                <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-250">
                        {featuredArticle.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {featuredArticle.date}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      <Link href={`/noticias/${featuredArticle.id}`}>{featuredArticle.title}</Link>
                    </h2>

                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {featuredArticle.summary}
                    </p>

                    <div className="text-xs text-slate-400 font-semibold pt-2">
                      Autor: <span className="text-slate-600 font-bold">{featuredArticle.author}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t mt-6">
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-1.5 cursor-pointer">
                      <Link href={`/noticias/${featuredArticle.id}`}>
                        Leer Artículo Completo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* --- GRILLA DE ARTÍCULOS SECUNDARIOS --- */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Más Novedades y Guías
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((article) => (
                <Card key={article.id} className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col justify-between group hover:shadow-md hover:border-emerald-500/20 transition-all">
                  <div>
                    <div className="relative h-48 w-full bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                          {article.tag}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {article.date}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                        <Link href={`/noticias/${article.id}`}>{article.title}</Link>
                      </h4>

                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t mt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Por: {article.author}</span>
                    <Link 
                      href={`/noticias/${article.id}`} 
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
                    >
                      Leer <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
