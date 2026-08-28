"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { mockArticles } from "../page";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  ArrowLeft, 
  User, 
  MessageSquare, 
  Send,
  AlertCircle,
  ShieldCheck,
  Thermometer
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
}

export default function NoticiasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const found = mockArticles.find(a => a.id === id);
    if (found) {
      setArticle(found);
      
      // Sembrar comentarios por defecto según el artículo
      if (id === "el-nino-2026") {
        setComments([
          {
            id: "c1",
            author: "Don Felipe Flores",
            role: "Agricultor - Motupe",
            date: "Hace 4 horas",
            content: "Excelente artículo de asesoría técnica. En Finca San José nos está costando bastante inducir la floración este año debido a las altas temperaturas nocturnas (21°C promedio). ¿Recomiendan aplicar nitrato de potasio al 2% o elevar al 3%?"
          },
          {
            id: "c2",
            author: "Ing. Carmen Soto",
            role: "Cooperativa Olmos",
            date: "Hace 2 horas",
            content: "Don Felipe, por experiencia en Olmos, el nitrato al 3% puede quemar las hojas tiernas bajo el sol intenso de la tarde. Sugerimos mantener 2% y alternar con inductores de floración a base de algas marinas y aminoácidos para reducir el estrés térmico."
          },
          {
            id: "c3",
            author: "Alberto Ramos",
            role: "Productor Ecológico - Jayanca",
            date: "Hace 30 minutos",
            content: "Para quienes estamos en Jayanca: no olviden retirar todos los frutos maduros descartados de las ramas y el suelo. Con este calor del Fenómeno de El Niño, el ciclo reproductivo de la mosca de la fruta se acelera y puede infestar hectáreas completas en días. ¡A trampear todos!"
          }
        ]);
      } else {
        setComments([
          {
            id: "c-other-1",
            author: "Doña Elena Ruiz",
            role: "Productora - Íllimo",
            date: "Hace 1 día",
            content: "¡Excelente noticia! Esto motiva a seguir cosechando con estándares altos. El mercado internacional valora mucho el mango Kent dulce de nuestro norte peruano."
          }
        ]);
      }
    }
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) {
      alert("Por favor completa tu nombre y comentario.");
      return;
    }

    const commentObj: Comment = {
      id: `c-${Date.now()}`,
      author: newCommentAuthor,
      role: "Comunidad MangoSync",
      date: "Hace un momento",
      content: newCommentText
    };

    setComments(prev => [commentObj, ...prev]);
    setNewCommentText("");
  };

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-20 flex flex-col items-center justify-center text-center bg-slate-50 px-4">
          <AlertCircle className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-extrabold text-slate-900">Artículo No Encontrado</h1>
          <p className="text-slate-500 text-sm mt-2">La noticia que estás intentando leer no existe o fue retirada.</p>
          <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
            <Link href="/noticias">Volver a Noticias</Link>
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
        
        {/* --- PORTADA DEL ARTÍCULO --- */}
        <div className="relative h-[250px] sm:h-[400px] w-full bg-slate-900">
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
          
          <Link 
            href="/noticias"
            className="absolute top-6 left-6 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 h-9 w-9 rounded-xl flex items-center justify-center transition-colors shadow-xs z-10 cursor-pointer"
            title="Volver a Noticias"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* --- CUERPO DEL ARTÍCULO --- */}
        <div className="container mx-auto px-4 md:px-8 relative -mt-16 sm:-mt-24 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contenido Principal */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-0.5 rounded-full">
                    {article.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {article.date}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4.5xl font-black text-slate-900 leading-tight">
                  {article.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold border-b border-t py-3">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Por: <strong className="text-slate-700 font-bold">{article.author}</strong></span>
                  <span className="text-slate-350 font-normal ml-2">|</span>
                  <span className="text-emerald-700 font-bold ml-2">Recomendado para productores de Piura y Lambayeque</span>
                </div>
              </div>

              {/* Contenido Editorial Técnico */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-5">
                <p className="font-semibold text-slate-800">
                  La campaña de mango Kent en el norte de Perú enfrenta una coyuntura sin precedentes. El aumento sostenido de la temperatura del mar debido al Fenómeno de El Niño está alterando los ciclos fenológicos de las plantaciones de mango Kent en valles claves como Motupe y Olmos.
                </p>
                
                <h3 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                  <Thermometer className="h-5 w-5 text-amber-500" />
                  1. El Impacto de las Temperaturas en la Floración
                </h3>
                <p>
                  El mango Kent requiere temperaturas mínimas inferiores a 16°C durante el invierno para inducir una floración uniforme. Con termómetros que marcan mínimas de 19°C a 21°C en la costa norte, las plantas tienden a generar brotes vegetativos (hojas) en lugar de yemas florales, reduciendo el rendimiento potencial hasta en un 60%.
                </p>

                <h3 className="text-lg font-bold text-slate-900 pt-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  2. Medidas de Mitigación Agronómica Recomendadas
                </h3>
                <p>
                  Los expertos recomiendan suspender temporalmente el riego por goteo durante los meses de inducción (estrés hídrico controlado) para indicarle al árbol que debe florecer. Asimismo, la aplicación foliar de nitrato de potasio al 2% combinado con inductores de floración ayuda a uniformizar las yemas.
                </p>

                <blockquote className="bg-emerald-50/50 border-l-4 border-emerald-650 p-4.5 rounded-r-2xl italic text-emerald-900 text-xs sm:text-sm font-semibold my-4">
                  "Un control biológico de trips y ácaros en la etapa de pre-floración evita que los insectos succionen la savia de las flores emergentes, reduciendo el riesgo de caída de flores tempranas."
                </blockquote>

                <h3 className="text-lg font-bold text-slate-900 pt-2">
                  3. Plan fitosanitario SENASA frente al Calor
                </h3>
                <p>
                  El incremento del calor acelera el ciclo de vida de la mosca de la fruta. Es imperativo limpiar los rastrojos y frutos caídos en la chacra, depositándolos en fosas de entierro cubiertas con tierra y cal a no menos de 50 cm. El trampeo fitosanitario debe reforzarse semanalmente.
                </p>
              </div>

            </div>

            {/* --- CAJA DE COMENTARIOS LATERAL / INFERIOR --- */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              
              <div className="flex items-center gap-2 border-b pb-3.5">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Comentarios ({comments.length})</h3>
              </div>

              {/* Formulario de Comentario */}
              <form onSubmit={handleAddComment} className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Publicar Consejo o Consulta</p>
                
                <div className="space-y-1">
                  <Label htmlFor="c-name" className="text-slate-600 text-[11px] font-semibold">Tu Nombre o Finca *</Label>
                  <Input
                    id="c-name"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder="Ej. Don Manuel Ramos"
                    className="h-8.5 rounded-lg text-xs border-slate-200 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-text" className="text-slate-600 text-[11px] font-semibold">Tu Comentario *</Label>
                  <textarea
                    id="c-text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Añade tu consejo técnico o responde a un agricultor..."
                    rows={3}
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs gap-1.5 cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  Publicar Comentario
                </Button>
              </form>

              {/* Listado de Comentarios */}
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {comments.map((comm) => (
                  <div key={comm.id} className="border-b pb-3.5 space-y-1.5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-xs">{comm.author}</h5>
                        <span className="text-[9px] text-emerald-700 font-semibold">{comm.role}</span>
                      </div>
                      <span className="text-[9px] text-slate-400">{comm.date}</span>
                    </div>
                    <p className="text-slate-650 text-[11px] leading-relaxed">
                      {comm.content}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
