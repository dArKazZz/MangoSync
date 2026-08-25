"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  PlusCircle, 
  Star, 
  ThumbsUp, 
  MapPin, 
  Calendar,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  Search
} from "lucide-react";

interface Answer {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  upvotes: number;
  answers: Answer[];
}

const initialQuestions: Question[] = [
  {
    id: "q1",
    title: "¿Cómo combatir el rebrote de trips en floración tardía del mango Kent?",
    description: "Tengo un lote en Motupe que ha empezado a florecer tarde debido a las olas de calor del Fenómeno de El Niño. Sin embargo, he notado una presencia inusual de trips alimentándose de las panículas florales. ¿Qué tratamientos orgánicos o químicos preventivos recomiendan que no afecten a las abejas?",
    author: "Don Felipe Flores",
    date: "Hace 1 día",
    category: "Fitosanitario (Plagas)",
    upvotes: 12,
    answers: [
      {
        id: "q1-a1",
        author: "Ing. Carmen Soto",
        role: "Asesora - Cooperativa Olmos",
        date: "Hace 18 horas",
        content: "Hola Felipe. Ante trips en floración, evita productos químicos de amplio espectro. Te sugiero aplicar extracto de neem combinado con jabón potásico al 1.5% durante el atardecer (cuando la actividad de abejas es nula). Esto asfixiará a los trips sin residualidad tóxica para los polinizadores."
      },
      {
        id: "q1-a2",
        author: "Alberto Ramos",
        role: "Productor - Finca Jayanca",
        date: "Hace 12 horas",
        content: "Nosotros en Jayanca liberamos controladores biológicos (específicamente larvas de Crisopa) en pre-floración y nos ha ayudado a mantener la población de trips por debajo del umbral de daño económico. Es una excelente opción orgánica."
      }
    ]
  },
  {
    id: "q2",
    title: "¿Alguien tiene contacto de transporte refrigerado para retirar fruta en Jayanca?",
    description: "Tengo pactada una entrega de 350 cajas de mango Kent bajo el incoterm DAP-Planta en Olmos para el próximo viernes y necesito un camión frigorífico de 8 a 10 toneladas que cuente con termógrafo operativo para resguardar la temperatura de la fruta.",
    author: "Alberto Ramos",
    date: "Hace 2 días",
    category: "Logística e Incoterms",
    upvotes: 4,
    answers: [
      {
        id: "q2-a1",
        author: "Ing. Carmen Soto",
        role: "Coordinadora - Cooperativa Olmos",
        date: "Hace 1 día",
        content: "Hola Alberto. En la cooperativa trabajamos con 'Transportes Fruteros del Norte'. Tienen unidades modernas con registro de frío. Puedes contactar al Sr. Luis Bazán al 987-654-321 de nuestra parte, suelen tener disponibilidad en la ruta Jayanca-Olmos."
      }
    ]
  },
  {
    id: "q3",
    title: "¿Cuál es la tolerancia de calidad que están aceptando los exportadores en planta esta semana?",
    description: "Quiero enviar un lote de mango Kent premium. Sin embargo, he escuchado que las empacadoras están muy estrictas por el trips y el manchado de látex. ¿Qué porcentaje de descarte promedio se está reportando en las auditorías fitosanitarias de recepción?",
    author: "Doña Elena Ruiz",
    date: "Hace 3 días",
    category: "Precios y Mercados",
    upvotes: 7,
    answers: [
      {
        id: "q3-a1",
        author: "Don Felipe Flores",
        role: "Agricultor - Motupe",
        date: "Hace 2 días",
        content: "Doña Elena, fui a la empacadora el lunes. Están muy rigurosos. Para fruta extra (exportación aérea) no toleran más de 2% de defectos mecánicos y 0% de daño por trips. Para marítimo están aceptando hasta un 5% de tolerancia de manchado leve de látex."
      }
    ]
  }
];

const CATEGORIES = ["Todos", "Fitosanitario (Plagas)", "Clima y Riego", "Logística e Incoterms", "Precios y Mercados"];

export default function ForoPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>("q1"); // por defecto primer hilo abierto
  const [upvotedIds, setUpvotedIds] = useState<{ [key: string]: boolean }>({});

  // Estados del Formulario de Pregunta
  const [showAskForm, setShowAskForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Fitosanitario (Plagas)");

  // Estado del Formulario de Respuesta
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newAnswerAuthor, setNewAnswerAuthor] = useState("");

  const handleUpvote = (qId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // evitar expandir/colapsar
    if (upvotedIds[qId]) {
      setQuestions(prev => prev.map(q => q.id === qId ? { ...q, upvotes: q.upvotes - 1 } : q));
      setUpvotedIds(prev => ({ ...prev, [qId]: false }));
    } else {
      setQuestions(prev => prev.map(q => q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q));
      setUpvotedIds(prev => ({ ...prev, [qId]: true }));
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newAuthor.trim()) {
      alert("Por favor completa todos los campos para publicar tu consulta.");
      return;
    }

    const newQ: Question = {
      id: `q-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      author: newAuthor,
      date: "Hace un momento",
      category: newCategory,
      upvotes: 0,
      answers: []
    };

    setQuestions(prev => [newQ, ...prev]);
    setExpandedQuestionId(newQ.id); // Expandir la nueva
    setShowAskForm(false);
    setNewTitle("");
    setNewDesc("");
  };

  const handleAddAnswer = (qId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerText.trim() || !newAnswerAuthor.trim()) {
      alert("Por favor escribe tu nombre y la respuesta técnica.");
      return;
    }

    const answerObj: Answer = {
      id: `a-${Date.now()}`,
      author: newAnswerAuthor,
      role: "Colaborador MangoSync",
      date: "Hace un momento",
      content: newAnswerText
    };

    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answers: [...q.answers, answerObj]
        };
      }
      return q;
    }));

    setNewAnswerText("");
  };

  // Filtrado de Preguntas
  const filteredQuestions = questions.filter(q => {
    const matchCategory = activeCategory === "Todos" || q.category === activeCategory;
    const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
        <div className="container mx-auto">
          
          {/* Cabecera del Foro */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Comunidad Agrícola B2B
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Foro Comunitario y Consultas del Mango
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Resuelve dudas técnicas sobre plagas, resiliencia climática y logística del mango Kent colaborando con agrónomos y agricultores experimentados del norte.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- SECCIÓN IZQUIERDA: CATEGORÍAS Y BÚSQUEDA --- */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Botón de Publicar Pregunta */}
              <Button 
                onClick={() => { setShowAskForm(!showAskForm); setExpandedQuestionId(null); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="h-5 w-5" />
                Hacer una Pregunta
              </Button>

              {/* Caja de Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                <Input
                  placeholder="Buscar en el foro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9.5 rounded-xl border-slate-200 bg-white"
                />
              </div>

              {/* Menú de Categorías */}
              <Card className="border border-slate-100 shadow-2xs rounded-3xl overflow-hidden bg-white">
                <div className="p-4 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  Categorías
                </div>
                <div className="p-2.5 flex flex-col gap-1 bg-white">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeCategory === cat 
                          ? "bg-emerald-50 text-emerald-800 font-extrabold border-l-4 border-emerald-600 pl-3" 
                          : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </Card>

            </div>

            {/* --- SECCIÓN DERECHA: HILOS Y FORMULARIOS --- */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Formulario de Nueva Pregunta (Condicional) */}
              {showAskForm && (
                <Card className="border border-emerald-500/20 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-5 animate-in fade-in duration-300">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-emerald-600" />
                      Publicar Nueva Consulta en el Foro
                    </h3>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAskForm(false)} 
                      className="text-slate-400 text-xs font-bold hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </Button>
                  </div>

                  <form onSubmit={handleCreateQuestion} className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Tu Nombre */}
                      <div className="space-y-1">
                        <Label htmlFor="author-name" className="font-semibold text-slate-700">Tu Nombre / Asociación *</Label>
                        <Input
                          id="author-name"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          placeholder="Ej. Manuel Bazán (Olmos)"
                          className="rounded-xl border-slate-200"
                        />
                      </div>

                      {/* Categoría de Pregunta */}
                      <div className="space-y-1">
                        <Label htmlFor="q-cat" className="font-semibold text-slate-700">Categoría *</Label>
                        <select
                          id="q-cat"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm cursor-pointer focus:ring-2 focus:ring-emerald-500"
                        >
                          {CATEGORIES.filter(c => c !== "Todos").map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Título de la Duda */}
                    <div className="space-y-1">
                      <Label htmlFor="title" className="font-semibold text-slate-700">Título de la Duda *</Label>
                      <Input
                        id="title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej. ¿Cómo calibrar aspersores en Finca San José?"
                        className="rounded-xl border-slate-200"
                      />
                    </div>

                    {/* Explicación Detallada */}
                    <div className="space-y-1">
                      <Label htmlFor="desc" className="font-semibold text-slate-700">Explicación Detallada *</Label>
                      <textarea
                        id="desc"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Detalla los síntomas de tus plantas, distritos afectados, o especificaciones requeridas..."
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 p-3 bg-white resize-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Publicar Pregunta en la Comunidad
                    </Button>
                  </form>
                </Card>
              )}

              {/* Listado de Preguntas Filtradas */}
              <div className="space-y-4">
                {filteredQuestions.map((q) => {
                  const isExpanded = expandedQuestionId === q.id;

                  return (
                    <Card 
                      key={q.id} 
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className={`border shadow-2xs rounded-3xl overflow-hidden bg-white transition-all duration-250 cursor-pointer ${
                        isExpanded ? "border-emerald-600/55" : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
                      }`}
                    >
                      {/* Cabecera de la Pregunta */}
                      <div className="p-6 flex items-start gap-4 justify-between">
                        <div className="space-y-2 flex-1">
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                              {q.category}
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {q.date}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                            {q.title}
                          </h4>

                          <p className="text-slate-500 text-xs sm:text-sm font-medium">
                            Publicado por: <span className="text-slate-700 font-bold">{q.author}</span>
                          </p>

                        </div>

                        {/* Botón de Votos y Expandir */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => handleUpvote(q.id, e)}
                            className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer h-14 w-12 justify-center ${
                              upvotedIds[q.id] 
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" 
                                : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-500"
                            }`}
                            title="Votar a favor"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-xs mt-1">{q.upvotes}</span>
                          </button>
                        </div>
                      </div>

                      {/* --- CUERPO EXPANDIDO (PREGUNTA DETALLADA Y RESPUESTAS) --- */}
                      {isExpanded && (
                        <div className="border-t bg-slate-50/50 p-6 space-y-6" onClick={(e) => e.stopPropagation() /* evitar colapsar al hacer clic adentro */}>
                          
                          {/* Descripción Completa */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-3xs space-y-2">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Detalles de la Consulta</p>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {q.description}
                            </p>
                          </div>

                          {/* Respuestas */}
                          <div className="space-y-4">
                            <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                              <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                              Respuestas de la Comunidad ({q.answers.length})
                            </h5>

                            {/* Listado de Respuestas */}
                            <div className="space-y-3">
                              {q.answers.map((ans) => (
                                <div key={ans.id} className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-3xs space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="font-bold text-slate-900 text-xs">{ans.author}</h6>
                                      <span className="text-[9px] text-emerald-700 font-semibold">{ans.role}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{ans.date}</span>
                                  </div>
                                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                                    {ans.content}
                                  </p>
                                </div>
                              ))}

                              {q.answers.length === 0 && (
                                <p className="text-slate-400 text-xs italic pl-2">Ningún productor o agrónomo ha respondido aún. ¡Sé el primero en aconsejar!</p>
                              )}
                            </div>

                          </div>

                          {/* Formulario para Responder */}
                          <form onSubmit={(e) => handleAddAnswer(q.id, e)} className="space-y-3.5 bg-white p-5 rounded-2xl border">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Responder Consulta</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor={`ans-author-${q.id}`} className="text-slate-600 text-[11px] font-semibold">Tu Nombre o Especialidad *</Label>
                                <Input
                                  id={`ans-author-${q.id}`}
                                  value={newAnswerAuthor}
                                  onChange={(e) => setNewAnswerAuthor(e.target.value)}
                                  placeholder="Ej. Ing. Juan Pérez"
                                  className="h-8.5 rounded-lg text-xs"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor={`ans-text-${q.id}`} className="text-slate-600 text-[11px] font-semibold">Tu Consejo Técnico *</Label>
                              <textarea
                                id={`ans-text-${q.id}`}
                                value={newAnswerText}
                                onChange={(e) => setNewAnswerText(e.target.value)}
                                placeholder="Escribe tu asesoría con sustento agronómico o información logística..."
                                rows={3}
                                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 resize-none focus:bg-white"
                              />
                            </div>

                            <Button 
                              type="submit" 
                              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs gap-1.5 cursor-pointer"
                            >
                              <Send className="h-3 w-3" />
                              Publicar Respuesta
                            </Button>
                          </form>

                        </div>
                      )}

                    </Card>
                  );
                })}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-20 border border-dashed rounded-3xl bg-white text-slate-400 text-sm">
                    No se encontraron consultas registradas en esta categoría.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
