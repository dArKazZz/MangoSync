"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Sprout, 
  User, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  FileText, 
  Cpu, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Star, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  DollarSign, 
  Truck, 
  Check,
  AwardIcon,
  ShieldAlert
} from "lucide-react";

// Distritos permitidos en el norte peruano
const DISTRITOS = ["Motupe", "Olmos", "Jayanca", "Íllimo", "Pacora", "Mórrope"];

// Tabla de niveles de MangoSync
const NIVELES = [
  { name: "Semilla", min: 0, max: 499, commission: 10, emoji: "🥭", color: "bg-slate-100 text-slate-700 border-slate-300", benefits: "Acceso básico a la plataforma" },
  { name: "Productor", min: 500, max: 999, commission: 8, emoji: "🌿", color: "bg-emerald-50 text-emerald-700 border-emerald-300", benefits: "Capacitación agrícola continua" },
  { name: "Avanzado", min: 1000, max: 1999, commission: 6, emoji: "🌳", color: "bg-teal-50 text-teal-700 border-teal-300", benefits: "Asesoría técnica especializada" },
  { name: "Premium", min: 2000, max: 2999, commission: 5, emoji: "🏆", color: "bg-amber-50 text-amber-700 border-amber-300", benefits: "Prioridad logística de transporte" },
  { name: "Élite", min: 3000, max: Infinity, commission: 4, emoji: "👑", color: "bg-purple-50 text-purple-700 border-purple-300", benefits: "Bonificaciones y exención de cuotas" }
];

export default function SimuladorPage() {
  const [step, setStep] = useState(1);

  // --- ESTADO GENERAL DEL PRODUCTOR (Simulado) ---
  const [producer, setProducer] = useState({
    name: "Don Felipe Flores",
    district: "Motupe",
    initialCajas: 350, // Comienza en nivel Semilla para ver el progreso a Productor
    currentCajas: 350,
    reputation: 4.7,
    transactionsCount: 12,
    senasaCertified: false,
    senasaDocUrl: ""
  });

  // --- ESTADO DE LA OFERTA (Paso 1) ---
  const [oferta, setOferta] = useState({
    distrito: "Motupe",
    variedad: "Mango Kent",
    volumen: 200, // cajas
    precioPorCaja: 45.0, // S/.
    fechaCosecha: "2026-09-15"
  });

  // --- ESTADO DE AGROPULSE IA (Paso 2) ---
  const [selectedPhoto, setSelectedPhoto] = useState("sana");
  const [temperature, setTemperature] = useState(28);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [iaResult, setIaResult] = useState({
    health: 98,
    flowering: 92,
    pest: "Ninguna",
    severity: "Baja",
    recommendation: "El cultivo se encuentra en condiciones óptimas. Mantener riego controlado.",
    gps: { lat: -5.7981, lon: -79.8519 }
  });

  // --- ESTADO DEL COMPRADOR (Paso 3) ---
  const [buyerRole, setBuyerRole] = useState("nacional"); // "nacional" | "exportador"
  const [filterDistrict, setFilterDistrict] = useState("Todos");
  const [filterSenasaOnly, setFilterSenasaOnly] = useState(false);

  // --- ESTADO DE LA NEGOCIACIÓN E INCOTERM (Paso 4) ---
  const [incoterm, setIncoterm] = useState("EXW-Chacra");
  const [qualityTolerance, setQualityTolerance] = useState("5%");
  const [paymentTerm, setPaymentTerm] = useState("Contra-entrega");

  // --- ESTADO DE CALIFICACIONES (Paso 6) ---
  const [ratingCalidad, setRatingCalidad] = useState(5);
  const [ratingPuntualidad, setRatingPuntualidad] = useState(5);
  const [ratingPago, setRatingPago] = useState(5);
  const [comentarios, setComentarios] = useState("Excelente entrega de Mango Kent, fruta dulce, limpia y sin fibra.");

  // --- ESTADO DE CONSOLIDACIÓN (Paso 7) ---
  const [levelUpTriggered, setLevelUpTriggered] = useState(false);
  const [confetti, setConfetti] = useState<any[]>([]);

  // Determinar nivel actual
  const getNivelInfo = (cajas: number) => {
    return NIVELES.find(n => cajas >= n.min && cajas <= n.max) || NIVELES[0];
  };

  const currentLevelInfo = getNivelInfo(producer.currentCajas);
  const nextLevelInfo = NIVELES[NIVELES.indexOf(currentLevelInfo) + 1] || null;

  // Manejar cambio de SENASA en Paso 1
  const handleSenasaToggle = (val: boolean) => {
    setProducer(prev => ({
      ...prev,
      senasaCertified: val,
      senasaDocUrl: val ? "expediente_senasa_felipe.pdf" : ""
    }));
  };

  // Simular análisis IA (Paso 2)
  const triggerIaAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);

      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLon = (Math.random() - 0.5) * 0.05;
      const baseLat = -5.7981; 
      const baseLon = -79.8519;

      if (selectedPhoto === "sana") {
        setIaResult({
          health: 96 + Math.floor(Math.random() * 4),
          flowering: 88 + Math.floor(Math.random() * 10),
          pest: "Ninguna",
          severity: "Baja",
          recommendation: "El cultivo se encuentra saludable con floración avanzada. Procede con el monitoreo regular.",
          gps: { lat: baseLat + offsetLat, lon: baseLon + offsetLon }
        });
      } else if (selectedPhoto === "trips") {
        setIaResult({
          health: 72 + Math.floor(Math.random() * 8),
          flowering: 65 + Math.floor(Math.random() * 12),
          pest: "Trips del Mango",
          severity: "Media",
          recommendation: "Se detectó infestación leve de Trips. Aplicar extracto de neem o jabón potásico en el sector afectado.",
          gps: { lat: baseLat + offsetLat, lon: baseLon + offsetLon }
        });
      } else {
        setIaResult({
          health: 48 + Math.floor(Math.random() * 15),
          flowering: 40 + Math.floor(Math.random() * 20),
          pest: "Mosca de la Fruta (Ceratitis capitata)",
          severity: "Crítica",
          recommendation: "URGENTE: Presencia confirmada de mosca de la fruta. Recoger frutos caídos, enterrar a 50cm y coordinar trampeo inmediato SENASA.",
          gps: { lat: baseLat + offsetLat, lon: baseLon + offsetLon }
        });
      }
    }, 1500);
  };

  // Restablecer el simulador al estado original
  const resetSimulator = () => {
    setStep(1);
    setProducer({
      name: "Don Felipe Flores",
      district: "Motupe",
      initialCajas: 350,
      currentCajas: 350,
      reputation: 4.7,
      transactionsCount: 12,
      senasaCertified: false,
      senasaDocUrl: ""
    });
    setOferta({
      distrito: "Motupe",
      variedad: "Mango Kent",
      volumen: 200,
      precioPorCaja: 45.0,
      fechaCosecha: "2026-09-15"
    });
    setSelectedPhoto("sana");
    setTemperature(28);
    setAnalyzed(false);
    setBuyerRole("nacional");
    setIncoterm("EXW-Chacra");
    setQualityTolerance("5%");
    setLevelUpTriggered(false);
    setConfetti([]);
  };

  // Calcular Comisión e Impuestos del Paso 5
  const valorTotalTransaccion = oferta.volumen * oferta.precioPorCaja;
  const tasaComision = currentLevelInfo.commission;
  const comisionMonto = (valorTotalTransaccion * tasaComision) / 100;
  const pagoProductor = valorTotalTransaccion - comisionMonto;

  // Finalizar paso 6 y sumar volumen en Paso 7
  const consolidateTransaction = () => {
    const finalVolume = producer.currentCajas + oferta.volumen;
    const oldLevel = getNivelInfo(producer.currentCajas);
    const newLevel = getNivelInfo(finalVolume);

    setProducer(prev => ({
      ...prev,
      currentCajas: finalVolume,
      reputation: parseFloat(((prev.reputation * prev.transactionsCount + (ratingCalidad + ratingPuntualidad) / 2) / (prev.transactionsCount + 1)).toFixed(2)),
      transactionsCount: prev.transactionsCount + 1
    }));

    if (newLevel.name !== oldLevel.name) {
      setLevelUpTriggered(true);
      // Lanzar confeti simulado
      const tempConfetti = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa"][Math.floor(Math.random() * 5)]
      }));
      setConfetti(tempConfetti);
    }
    setStep(7);
  };

  // Auto-ajustar incoterms si cambia a exportador/nacional
  useEffect(() => {
    if (buyerRole === "exportador" && producer.senasaCertified) {
      setIncoterm("FOB-Planta");
    } else {
      setIncoterm("EXW-Chacra");
    }
  }, [buyerRole, producer.senasaCertified]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
        <div className="container mx-auto">
          {/* Encabezado Principal */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-xs border">
            <div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Área de Innovación
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
                Simulador del Prototipo MangoSync
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Recorrido interactivo de los Módulos 1 al 4 de la Especificación Funcional (Reto Mango 2026).
              </p>
            </div>
            <Button 
              onClick={resetSimulator} 
              variant="outline" 
              className="rounded-xl border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reiniciar Simulación
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- PANEL DE CONTROL LATERAL (ESTADO EN TIEMPO REAL) --- */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-emerald-800 text-white p-6 pb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Estado del Agricultor</CardTitle>
                      <CardDescription className="text-emerald-200 text-xs">Actor: Productor Chacra</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 -mt-4 bg-white rounded-t-3xl relative z-10 space-y-5">
                  {/* Fila Nombre */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-semibold">Nombre:</span>
                    <span className="text-slate-800 font-bold">{producer.name}</span>
                  </div>

                  {/* Fila Distrito */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-semibold">Zona:</span>
                    <span className="text-slate-800 font-bold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" /> {producer.district}
                    </span>
                  </div>

                  <Separator />

                  {/* Fila Nivel */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-semibold">Nivel:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${currentLevelInfo.color}`}>
                        <span>{currentLevelInfo.emoji}</span>
                        <span>{currentLevelInfo.name}</span>
                      </span>
                    </div>

                    {/* Barra de progreso */}
                    {nextLevelInfo && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>{producer.currentCajas} / {nextLevelInfo.min} cajas</span>
                          <span>Faltan {nextLevelInfo.min - producer.currentCajas} cajas</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                            style={{ width: `${(producer.currentCajas / nextLevelInfo.min) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Fila Comisión y Beneficios */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-semibold">Tasa de Comisión:</span>
                      <span className="text-emerald-700 font-extrabold text-lg">{currentLevelInfo.commission}%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                      <Award className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-700">Beneficio del Nivel:</p>
                        <p>{currentLevelInfo.benefits}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Fila Certificación SENASA */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-semibold">Certificado SENASA:</span>
                    {producer.senasaCertified ? (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-600 fill-amber-500/10" /> Certificado
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        Inactivo
                      </span>
                    )}
                  </div>

                  {/* Reputación */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-400 text-sm font-semibold">Reputación:</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {producer.reputation} ({producer.transactionsCount} ventas)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Registro Histórico Local de AgroPulse */}
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-900 text-white p-5">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-400" />
                    Historial AgroPulse IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3.5 text-xs">
                  {analyzed ? (
                    <div className="border-l-2 border-emerald-500 pl-3 py-1 space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Lote 01 - Sector A</span>
                        <span className="text-slate-400 font-normal">Hace un momento</span>
                      </div>
                      <p className="text-slate-500">Resultado: {iaResult.pest === "Ninguna" ? "Sano" : `Plaga: ${iaResult.pest}`}</p>
                      <p className="text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Lat: {iaResult.gps.lat.toFixed(4)}, Lon: {iaResult.gps.lon.toFixed(4)}
                      </p>
                    </div>
                  ) : null}
                  <div className="border-l-2 border-slate-300 pl-3 py-1 space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Lote 02 - Sector B</span>
                      <span className="text-slate-400 font-normal">24 Jul 2026</span>
                    </div>
                    <p className="text-slate-500">Resultado: Sano (Floración 95%)</p>
                    <p className="text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Lat: -5.7990, Lon: -79.8520
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-3 py-1 space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Lote 01 - Sector A</span>
                      <span className="text-slate-400 font-normal">10 Jun 2026</span>
                    </div>
                    <p className="text-slate-500 text-amber-700 font-semibold">Resultado: Trips del Mango (Severidad Leve)</p>
                    <p className="text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Lat: -5.7975, Lon: -79.8505
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- CONTENIDO PRINCIPAL: WIZARD DE 7 PASOS --- */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Barra de Progreso del Pasos */}
              <div className="bg-white p-4 rounded-3xl shadow-xs border flex items-center justify-between overflow-x-auto gap-2">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const stepNum = idx + 1;
                  const isActive = step === stepNum;
                  const isDone = step > stepNum;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isActive 
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-100" 
                            : isDone 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : stepNum}
                      </div>
                      <span className={`text-xs font-bold hidden sm:inline whitespace-nowrap ${isActive ? "text-slate-900" : isDone ? "text-emerald-700" : "text-slate-400"}`}>
                        {stepNum === 1 && "Oferta"}
                        {stepNum === 2 && "AgroPulse IA"}
                        {stepNum === 3 && "Comprador"}
                        {stepNum === 4 && "Contrato"}
                        {stepNum === 5 && "Comisión"}
                        {stepNum === 6 && "Calificación"}
                        {stepNum === 7 && "Consolidación"}
                      </span>
                      {stepNum < 7 && <ArrowRight className="h-3 w-3 text-slate-300 hidden sm:inline" />}
                    </div>
                  );
                })}
              </div>

              {/* Contenido del Paso Activo */}
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                
                {/* --- PASO 1: REGISTRO DE OFERTA --- */}
                {step === 1 && (
                  <>
                    <CardHeader className="bg-amber-500/10 p-6 border-b border-amber-500/10">
                      <div className="flex items-center gap-2.5">
                        <Sprout className="h-6 w-6 text-amber-600" />
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-950">Paso 1: Publicación de Oferta (Módulo 1)</CardTitle>
                          <CardDescription className="text-slate-600 text-xs">Registra tu lote de mango Kent y opcionalmente añade tu certificación SENASA</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Selector de Distrito */}
                        <div className="space-y-2">
                          <Label htmlFor="district" className="font-semibold text-slate-700 text-sm">Zona / Distrito de Chacra *</Label>
                          <select 
                            id="district"
                            value={oferta.distrito}
                            onChange={(e) => {
                              setOferta(prev => ({ ...prev, distrito: e.target.value }));
                              setProducer(prev => ({ ...prev, district: e.target.value }));
                            }}
                            className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                          >
                            {DISTRITOS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* Variedad de Mango (Kent obligatoria) */}
                        <div className="space-y-2">
                          <Label htmlFor="variety" className="font-semibold text-slate-700 text-sm">Variedad *</Label>
                          <Input 
                            id="variety" 
                            value={oferta.variedad} 
                            disabled 
                            className="bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-700" 
                          />
                        </div>

                        {/* Volumen en Cajas */}
                        <div className="space-y-2">
                          <Label htmlFor="volumen" className="font-semibold text-slate-700 text-sm">Volumen de la Cosecha (Cajas) *</Label>
                          <Input 
                            id="volumen" 
                            type="number"
                            value={oferta.volumen}
                            onChange={(e) => setOferta(prev => ({ ...prev, volumen: Math.max(1, parseInt(e.target.value) || 0) }))}
                            className="border-slate-200 rounded-xl"
                          />
                          <p className="text-slate-400 text-xs font-semibold">Peso equivalente: ~{(oferta.volumen * 20).toLocaleString()} kg total</p>
                        </div>

                        {/* Precio Estimado */}
                        <div className="space-y-2">
                          <Label htmlFor="price" className="font-semibold text-slate-700 text-sm">Precio Deseado por Caja (S/.) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400 font-bold text-sm">S/.</span>
                            <Input 
                              id="price" 
                              type="number" 
                              value={oferta.precioPorCaja}
                              onChange={(e) => setOferta(prev => ({ ...prev, precioPorCaja: Math.max(1, parseFloat(e.target.value) || 0) }))}
                              className="pl-9 border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Fecha de Cosecha */}
                        <div className="space-y-2">
                          <Label htmlFor="harvest-date" className="font-semibold text-slate-700 text-sm">Fecha Estimada de Cosecha *</Label>
                          <Input 
                            id="harvest-date" 
                            type="date" 
                            value={oferta.fechaCosecha}
                            onChange={(e) => setOferta(prev => ({ ...prev, fechaCosecha: e.target.value }))}
                            className="border-slate-200 rounded-xl cursor-pointer"
                          />
                        </div>

                        {/* Toggle de Certificación SENASA */}
                        <div className="space-y-2">
                          <Label className="font-semibold text-slate-700 text-sm block mb-1">Certificación Fitosanitaria SENASA</Label>
                          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <input 
                              type="checkbox" 
                              id="senasa-toggle"
                              checked={producer.senasaCertified}
                              onChange={(e) => handleSenasaToggle(e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <Label htmlFor="senasa-toggle" className="text-xs text-slate-600 font-semibold cursor-pointer">
                              Cargar Certificado Vigente SENASA (Habilita el Segmento Exportación)
                            </Label>
                          </div>
                        </div>

                      </div>

                      {/* Notificación de flujo */}
                      <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-2xl border border-emerald-100 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">Información de Simulación:</p>
                          <p className="mt-0.5 leading-relaxed">
                            Al hacer clic en "Siguiente", simularás ser el agricultor y cargarás el lote de mango al Módulo 2 para realizar la evaluación de salud del cultivo con la cámara/IA de tu celular.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                {/* --- PASO 2: AGROPULSE IA (EVALUACIÓN DE CAMPO) --- */}
                {step === 2 && (
                  <>
                    <CardHeader className="bg-slate-900 text-white p-6">
                      <div className="flex items-center gap-2.5">
                        <Cpu className="h-6 w-6 text-emerald-400" />
                        <div>
                          <CardTitle className="text-xl font-bold">Paso 2: Evaluación de Campo IA — AgroPulse (Módulo 2)</CardTitle>
                          <CardDescription className="text-slate-400 text-xs">Simula el procesamiento de una imagen fito-sanitaria para generar el expediente técnico de SENASA</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Selector de Foto Muestra */}
                        <div className="space-y-4">
                          <Label className="font-semibold text-slate-700 text-sm block">Selecciona la Foto Fitosanitaria a Analizar</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <button 
                              onClick={() => { setSelectedPhoto("sana"); setAnalyzed(false); }}
                              className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                                selectedPhoto === "sana" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="h-14 w-14 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg font-bold">🌿</div>
                              <span className="text-xs font-bold text-slate-800">Cultivo Sano</span>
                            </button>
                            
                            <button 
                              onClick={() => { setSelectedPhoto("trips"); setAnalyzed(false); }}
                              className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                                selectedPhoto === "trips" ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="h-14 w-14 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg font-bold">🐛</div>
                              <span className="text-xs font-bold text-slate-800">Trips Leve</span>
                            </button>

                            <button 
                              onClick={() => { setSelectedPhoto("mosca"); setAnalyzed(false); }}
                              className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                                selectedPhoto === "mosca" ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="h-14 w-14 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 text-lg font-bold">🪰</div>
                              <span className="text-xs font-bold text-slate-800">Mosca Crítica</span>
                            </button>
                          </div>

                          {/* Control Deslizante de Temperatura */}
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                              <span>Temperatura del Entorno</span>
                              <span className="text-amber-600 font-extrabold flex items-center gap-0.5"><Thermometer className="h-4 w-4" /> {temperature}°C</span>
                            </div>
                            <Slider 
                              value={[temperature]} 
                              onValueChange={(val) => { setTemperature(val[0]); setAnalyzed(false); }}
                              min={15} 
                              max={42} 
                              step={1} 
                            />
                            <p className="text-slate-400 text-xs">Datos recolectados automáticamente mediante geolocalización.</p>
                          </div>

                          {/* Botón de Ejecutar Análisis */}
                          <Button 
                            onClick={triggerIaAnalysis}
                            disabled={isAnalyzing}
                            className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-3 rounded-xl gap-2 cursor-pointer mt-4"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Procesando imagen en servidor IA...
                              </>
                            ) : (
                              <>
                                <Cpu className="h-4 w-4 text-emerald-400" />
                                Ejecutar Análisis AgroPulse IA
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Visor de Resultados */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
                          {!analyzed ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                              <Cpu className="h-10 w-10 text-slate-300 animate-pulse mb-3" />
                              <p className="font-bold text-sm">Esperando imagen...</p>
                              <p className="text-xs mt-1">Presiona el botón de análisis para procesar la salud del lote.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Diagnóstico IA</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  iaResult.severity === "Baja" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : iaResult.severity === "Media"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                                }`}>
                                  Severidad: {iaResult.severity}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm font-semibold">
                                  <span className="text-slate-600">Salud Fito-Foliar:</span>
                                  <span className={iaResult.health > 80 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{iaResult.health}%</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold">
                                  <span className="text-slate-600">% de Floración:</span>
                                  <span className="text-slate-800 font-bold">{iaResult.flowering}%</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold">
                                  <span className="text-slate-600">Plaga Detectada:</span>
                                  <span className={iaResult.pest === "Ninguna" ? "text-slate-800 font-semibold" : "text-rose-700 font-extrabold"}>{iaResult.pest}</span>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-100 text-xs">
                                <span className="font-bold text-slate-800 block">Tratamiento Recomendado:</span>
                                <p className="text-slate-600 mt-1 leading-relaxed">{iaResult.recommendation}</p>
                              </div>

                              {/* Expediente Técnico de SENASA */}
                              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-center justify-between text-xs mt-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-emerald-600" />
                                  <div>
                                    <p className="font-bold text-emerald-800">Expediente Pre-SENASA</p>
                                    <p className="text-emerald-600 text-[10px]">Expediente Fitosanitario Digital Generado</p>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => alert("Simulando descarga de 'expediente_senasa_motupe.pdf'") }
                                  className="h-8 rounded-lg bg-white border-emerald-200 text-emerald-700 text-xs hover:bg-emerald-50 font-bold cursor-pointer"
                                >
                                  Descargar
                                </Button>
                              </div>

                            </div>
                          )}
                        </div>

                      </div>

                    </CardContent>
                  </>
                )}

                {/* --- PASO 3: BÚSQUEDA DEL COMPRADOR --- */}
                {step === 3 && (
                  <>
                    <CardHeader className="bg-emerald-50/15 p-6 border-b border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <Search className="h-6 w-6 text-emerald-600" />
                        <div>
                          <CardTitle className="text-xl font-bold">Paso 3: Búsqueda del Comprador (Módulo 1 + 4)</CardTitle>
                          <CardDescription className="text-slate-600 text-xs">Elige tu rol de comprador, aplica los filtros regionales y encuentra la oferta</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      {/* Alternador de Rol de Comprador */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                        <Label className="font-bold text-slate-800 text-sm block">Rol de Comprador Simulado</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => { setBuyerRole("nacional"); setFilterSenasaOnly(false); }}
                            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              buyerRole === "nacional" ? "border-emerald-600 bg-white shadow-xs" : "border-transparent hover:bg-slate-100"
                            }`}
                          >
                            <p className="font-extrabold text-sm text-slate-800">Comprador Nacional</p>
                            <p className="text-slate-400 text-xs mt-0.5">Mercados locales, bodegas y distribuidores locales.</p>
                          </button>
                          
                          <button
                            onClick={() => setBuyerRole("exportador")}
                            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              buyerRole === "exportador" ? "border-emerald-600 bg-white shadow-xs" : "border-transparent hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-extrabold text-sm text-slate-800">Comprador Exportador</p>
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">SENASA Habilitado</span>
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5">Empacadoras de fruta de exportación y compañías de trading.</p>
                          </button>
                        </div>
                      </div>

                      {/* Panel de Filtros */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 border rounded-3xl shadow-2xs">
                        
                        {/* Filtro por Distrito */}
                        <div className="space-y-2">
                          <Label htmlFor="filter-dist" className="font-semibold text-slate-700 text-sm">Filtrar por Zona (Norte Peruano)</Label>
                          <select
                            id="filter-dist"
                            value={filterDistrict}
                            onChange={(e) => setFilterDistrict(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm cursor-pointer"
                          >
                            <option value="Todos">Todos los distritos</option>
                            {DISTRITOS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* Filtro Exclusivo SENASA (Solo visible para Comprador Exportador) */}
                        <div className="flex items-center pt-6">
                          {buyerRole === "exportador" ? (
                            <div className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-2xl border border-amber-200 w-full">
                              <input
                                type="checkbox"
                                id="filter-senasa"
                                checked={filterSenasaOnly}
                                onChange={(e) => setFilterSenasaOnly(e.target.checked)}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                              <Label htmlFor="filter-senasa" className="text-xs text-amber-900 font-bold cursor-pointer flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-amber-600 fill-amber-500/10" />
                                Mostrar Solo Productores Certificados SENASA
                              </Label>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 italic">
                              * El filtro exclusivo de Certificación SENASA está deshabilitado para compradores nacionales.
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Lista de Resultados de Ofertas */}
                      <div className="space-y-3.5">
                        <Label className="font-bold text-slate-800 text-sm block">Ofertas de Mango Kent Disponibles</Label>
                        
                        {/* Lógica de Filtro Simulada */}
                        { (filterDistrict !== "Todos" && filterDistrict !== oferta.distrito) || (filterSenasaOnly && !producer.senasaCertified) ? (
                          <div className="text-center p-8 border border-dashed rounded-3xl text-slate-400 text-sm">
                            No se encontraron ofertas que coincidan con los filtros aplicados.
                          </div>
                        ) : (
                          <div className="border border-slate-200 rounded-3xl p-5 hover:border-emerald-500/60 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-slate-800">{oferta.variedad} Premium</h4>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {oferta.distrito}
                                </span>
                                {producer.senasaCertified && (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600 fill-amber-500/10" /> SENASA
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-xs mt-1">Vendedor: {producer.name} ({producer.reputation} ★)</p>
                              <p className="text-slate-400 text-xs mt-0.5">Volumen: {oferta.volumen} cajas (~{(oferta.volumen * 20).toLocaleString()} kg) · Cosecha: {oferta.fechaCosecha}</p>
                            </div>
                            <div className="flex items-center gap-4 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                              <div className="text-right">
                                <p className="text-slate-400 text-xs font-semibold">Precio por caja</p>
                                <p className="text-emerald-700 font-extrabold text-xl">S/. {oferta.precioPorCaja.toFixed(2)}</p>
                              </div>
                              <Button 
                                onClick={() => setStep(4)} 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 cursor-pointer"
                              >
                                Seleccionar Oferta
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </>
                )}

                {/* --- PASO 4: TÉRMINOS E INCOTERMS --- */}
                {step === 4 && (
                  <>
                    <CardHeader className="bg-amber-500/10 p-6 border-b border-amber-500/10">
                      <div className="flex items-center gap-2.5">
                        <Truck className="h-6 w-6 text-amber-600" />
                        <div>
                          <CardTitle className="text-xl font-bold">Paso 4: Términos e Incoterms del Mango (Módulo 3 + 4)</CardTitle>
                          <CardDescription className="text-slate-600 text-xs">Acuerda la entrega mediante Incoterms adaptados a la cadena del mango nacional</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Selector de Incoterm */}
                        <div className="space-y-2">
                          <Label htmlFor="incoterm" className="font-semibold text-slate-700 text-sm">Incoterm Nacional del Mango *</Label>
                          <select
                            id="incoterm"
                            value={incoterm}
                            onChange={(e) => setIncoterm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm cursor-pointer"
                          >
                            <option value="EXW-Chacra">EXW-Chacra (Recojo en la chacra del agricultor)</option>
                            <option value="FCA-Acopio">FCA-Acopio (Entrega en centro de acopio regional)</option>
                            <option value="DAP-Destino">DAP-Destino (Entrega en almacén del comprador)</option>
                            <option value="DDP-Destino">DDP-Destino (Entrega total con costos incluidos)</option>
                            
                            {/* FOB-Planta condicionado */}
                            <option 
                              value="FOB-Planta" 
                              disabled={!producer.senasaCertified || buyerRole !== "exportador"}
                            >
                              FOB-Planta (Solo Exportación & Certificados SENASA)
                            </option>
                          </select>
                        </div>

                        {/* Tolerancia de Calidad */}
                        <div className="space-y-2">
                          <Label htmlFor="tolerance" className="font-semibold text-slate-700 text-sm">Tolerancia de Calidad Pactada *</Label>
                          <select
                            id="tolerance"
                            value={qualityTolerance}
                            onChange={(e) => setQualityTolerance(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm cursor-pointer"
                          >
                            <option value="1%">1% de Tolerancia de defectos (Mango Premium)</option>
                            <option value="3%">3% de Tolerancia de defectos (Mango Estándar)</option>
                            <option value="5%">5% de Tolerancia de defectos (Mango Comercial)</option>
                          </select>
                        </div>

                        {/* Forma de Pago */}
                        <div className="space-y-2">
                          <Label htmlFor="payment-term" className="font-semibold text-slate-700 text-sm">Forma de Pago Pactada *</Label>
                          <select
                            id="payment-term"
                            value={paymentTerm}
                            onChange={(e) => setPaymentTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-sm cursor-pointer"
                          >
                            <option value="Contra-entrega">Pago contra entrega en Destino/Chacra</option>
                            <option value="Transferencia-24h">Transferencia bancaria dentro de las 24 horas</option>
                            <option value="Credito-15d">Crédito comercial a 15 días</option>
                          </select>
                        </div>

                        {/* Detalle de Incoterm Seleccionado */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 flex flex-col justify-center">
                          <p className="font-bold text-slate-800 mb-1">Descripción del Incoterm:</p>
                          {incoterm === "EXW-Chacra" && "El comprador asume toda la responsabilidad y el transporte desde la finca del agricultor."}
                          {incoterm === "FCA-Acopio" && "El productor se encarga del traslado de la fruta hasta el punto de acopio local seleccionado."}
                          {incoterm === "DAP-Destino" && "El productor cubre el flete hasta tu almacén, pero tú te encargas de la descarga de las cajas."}
                          {incoterm === "DDP-Destino" && "El productor entrega la fruta en tu destino final, asumiendo descarga, flete e impuestos locales."}
                          {incoterm === "FOB-Planta" && "Exclusivo exportación: La fruta se entrega en la empacadora/planta de procesamiento certificada lista para su embalaje final."}
                        </div>

                      </div>

                      {/* Notificación de Bloqueo de FOB-Planta */}
                      {!producer.senasaCertified || buyerRole !== "exportador" ? (
                        <div className="bg-rose-50 text-rose-800 text-xs p-4 rounded-2xl border border-rose-100 flex items-start gap-2.5">
                          <ShieldAlert className="h-4.5 w-4.5 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
                          <div>
                            <p className="font-bold">Restricción de Incoterm FOB-Planta:</p>
                            <p className="mt-0.5 leading-relaxed">
                              El incoterm **FOB-Planta** está bloqueado porque {
                                !producer.senasaCertified && buyerRole !== "exportador"
                                  ? "el agricultor no está certificado por SENASA y tu rol es Comprador Nacional"
                                  : !producer.senasaCertified
                                    ? "el agricultor actual no cuenta con certificado SENASA activo"
                                    : "has seleccionado el rol de Comprador Nacional"
                              }. Requiere validación del certificado fitosanitario del productor y rol de exportador (puedes activar ambos en los pasos anteriores).
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 text-amber-800 text-xs p-4 rounded-2xl border border-amber-200 flex items-start gap-2.5 shadow-2xs">
                          <ShieldCheck className="h-4.5 w-4.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-amber-900">Beneficio SENASA Activo:</p>
                            <p className="mt-0.5 leading-relaxed">
                              ¡Incoterm **FOB-Planta** desbloqueado! Cumples con los requisitos de certificación del lote fitosanitario y perfil comercial exportador.
                            </p>
                          </div>
                        </div>
                      )}

                    </CardContent>
                  </>
                )}

                {/* --- PASO 5: CÁLCULO DE COMISIÓN --- */}
                {step === 5 && (
                  <>
                    <CardHeader className="bg-slate-900 text-white p-6">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                        <div>
                          <CardTitle className="text-xl font-bold">Paso 5: Cálculo de Comisión e Incentivos (Módulo 1)</CardTitle>
                          <CardDescription className="text-slate-400 text-xs">Cálculo automático de comisión MangoSync reducido según el nivel de volumen acumulado</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      {/* Desglose de Caja de Cálculos */}
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                        <h4 className="font-bold text-slate-800 text-base">Liquidación de Venta</h4>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal Venta de Mango Kent ({oferta.volumen} cajas x S/. {oferta.precioPorCaja.toFixed(2)})</span>
                            <span className="font-bold text-slate-800">S/. {valorTotalTransaccion.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Tasa de Comisión MangoSync (Nivel {currentLevelInfo.name})</span>
                            <span className="font-bold text-slate-800">{tasaComision}%</span>
                          </div>

                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Comisión Retenida para Plataforma</span>
                            <span className="font-bold text-rose-600">- S/. {comisionMonto.toFixed(2)}</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-extrabold text-slate-900 text-lg">Pago Neto al Agricultor</p>
                            <p className="text-slate-400 text-[10px]">Depositado directamente mediante transferencia</p>
                          </div>
                          <span className="text-emerald-700 font-black text-2xl">S/. {pagoProductor.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Explicación Gamificación */}
                      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-xs space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Award className="h-4.5 w-4.5 text-emerald-700" />
                          <h5 className="font-extrabold text-emerald-950 text-sm">Programa de Incentivos de MangoSync</h5>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          La comisión base del sistema es del **10%** (nivel Semilla). Como {producer.name} tiene un volumen acumulado de **{producer.currentCajas} cajas**, pertenece al nivel **{currentLevelInfo.name} {currentLevelInfo.emoji}**, reduciendo la comisión de esta transacción a un **{currentLevelInfo.commission}%**.
                        </p>
                        <p className="text-slate-500 leading-relaxed font-semibold">
                          ¡Si completas esta venta de {oferta.volumen} cajas, sumarás un volumen acumulado de {producer.currentCajas + oferta.volumen} cajas, lo que le permitirá a Don Felipe alcanzar el nivel {getNivelInfo(producer.currentCajas + oferta.volumen).name}!
                        </p>
                      </div>

                    </CardContent>
                  </>
                )}

                {/* --- PASO 6: CALIFICACIÓN MUTUA --- */}
                {step === 6 && (
                  <>
                    <CardHeader className="bg-slate-900 text-white p-6">
                      <div className="flex items-center gap-2.5">
                        <Star className="h-6 w-6 text-amber-400" />
                        <div>
                          <CardTitle className="text-xl font-bold">Paso 6: Calificación Post-Compra (Módulo 3)</CardTitle>
                          <CardDescription className="text-slate-400 text-xs">Simula la calificación mutua al cerrar la transacción para actualizar la reputación en la red</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Calificación al Productor */}
                        <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-1.5">
                            <User className="h-4 w-4 text-emerald-600" /> Comprador califica a Don Felipe
                          </h4>
                          
                          <div className="space-y-3">
                            {/* Calidad de Fruta */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 font-semibold">Calidad del Mango Kent:</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(star => (
                                  <Star 
                                    key={star} 
                                    onClick={() => setRatingCalidad(star)}
                                    className={`h-4.5 w-4.5 cursor-pointer ${star <= ratingCalidad ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Cumplimiento de Volumen */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 font-semibold">Cumplimiento de Volumen:</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(star => (
                                  <Star 
                                    key={star} 
                                    onClick={() => setRatingPuntualidad(star)}
                                    className={`h-4.5 w-4.5 cursor-pointer ${star <= ratingPuntualidad ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <Label htmlFor="comm" className="text-slate-600 text-xs font-semibold">Comentarios sobre la Cosecha:</Label>
                            <textarea 
                              id="comm"
                              value={comentarios}
                              onChange={(e) => setComentarios(e.target.value)}
                              rows={2}
                              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white resize-none"
                            />
                          </div>
                        </div>

                        {/* Calificación al Comprador */}
                        <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                          <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-1.5">
                            <User className="h-4 w-4 text-amber-600" /> Don Felipe califica al Comprador
                          </h4>
                          
                          <div className="space-y-3">
                            {/* Puntualidad de Pago */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 font-semibold">Puntualidad del Pago:</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(star => (
                                  <Star 
                                    key={star} 
                                    onClick={() => setRatingPago(star)}
                                    className={`h-4.5 w-4.5 cursor-pointer ${star <= ratingPago ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-500 mt-5">
                            <p className="font-semibold text-slate-600">Forma de Pago Acordada:</p>
                            <p className="mt-0.5">{paymentTerm} con Incoterm {incoterm}.</p>
                          </div>
                        </div>

                      </div>

                      <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500">
                        Al presionar "Consolidar Transacción", los datos se procesarán, la reputación de Don Felipe se recalculará, y las cajas se sumarán a su historial.
                      </div>

                    </CardContent>
                  </>
                )}

                {/* --- PASO 7: CONSOLIDACIÓN Y LEVEL UP --- */}
                {step === 7 && (
                  <>
                    <CardHeader className="bg-emerald-600 text-white p-8 text-center relative overflow-hidden">
                      {/* Confeti Simulado en CSS */}
                      {confetti.map((conf) => (
                        <div 
                          key={conf.id} 
                          className="absolute w-2 h-5 rounded-xs animate-bounce opacity-85"
                          style={{
                            left: `${conf.left}%`,
                            top: `${-20 + Math.random() * 40}%`,
                            backgroundColor: conf.color,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animationDuration: `${1.5 + conf.delay}s`,
                            animationIterationCount: "infinite"
                          }}
                        />
                      ))}

                      <div className="flex flex-col items-center gap-3 relative z-10">
                        <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-black">¡Transacción Consolidada Exitosamente!</CardTitle>
                        <CardDescription className="text-emerald-100 text-sm">El flujo operativo del prototipo se ha completado de principio a fin.</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        
                        {/* Resultados del Productor */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 text-base">Actualización del Perfil de Don Felipe</h4>
                          
                          <div className="space-y-3.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-semibold">Cajas Vendidas Anteriormente:</span>
                              <span className="text-slate-800 font-bold">{producer.currentCajas - oferta.volumen} cajas</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-semibold">Volumen de esta Venta:</span>
                              <span className="text-emerald-600 font-extrabold">+ {oferta.volumen} cajas</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-slate-800 font-extrabold">Nuevo Volumen Acumulado:</span>
                              <span className="text-slate-900 font-black text-base">{producer.currentCajas} cajas</span>
                            </div>
                          </div>

                          {/* Mensaje de Subida de Nivel */}
                          {levelUpTriggered && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                              <AwardIcon className="h-6 w-6 text-amber-600 flex-shrink-0 animate-bounce" />
                              <div>
                                <h5 className="font-black text-amber-900 text-sm">¡Subida de Nivel Detectada!</h5>
                                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                  ¡Felicidades! Don Felipe ha ascendido a nivel **{currentLevelInfo.name} {currentLevelInfo.emoji}**. Su comisión en MangoSync disminuyó y ahora cuenta con acceso a nuevos beneficios.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Detalle de Beneficios Desbloqueados */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                          <h5 className="font-bold text-slate-800 text-sm">Beneficios de Nivel Activos:</h5>
                          
                          <ul className="space-y-2 text-xs text-slate-600">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-600" />
                              <span>Tasa de comisión reducida a **{currentLevelInfo.commission}%** de por vida.</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-600" />
                              <span>{currentLevelInfo.benefits}</span>
                            </li>
                            {producer.senasaCertified && (
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-600" />
                                <span>Acreditación SENASA activa (prioridad de visibilidad para compradores de exportación).</span>
                              </li>
                            )}
                          </ul>

                          <Separator />

                          <div className="space-y-2 text-xs">
                            <span className="font-bold text-slate-700 block">Comentarios del Comprador:</span>
                            <p className="bg-white p-3 rounded-xl border italic text-slate-500">
                              "{comentarios}"
                            </p>
                          </div>
                        </div>

                      </div>

                      <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-2xl border border-emerald-100 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">Fin de la Simulación Funcional:</p>
                          <p className="mt-0.5 leading-relaxed">
                            Has completado con éxito la simulación integrada del Reto Mango. Puedes reiniciar el flujo usando el botón "Reiniciar Simulación" del encabezado para evaluar otros caminos (ej. sin certificación SENASA o con plaga crítica).
                          </p>
                        </div>
                      </div>

                    </CardContent>
                  </>
                )}

                {/* --- BOTONES DE ACCIÓN DEL ASISTENTE --- */}
                {step < 7 && (
                  <div className="bg-slate-50 p-6 border-t flex justify-between items-center">
                    <Button 
                      onClick={() => setStep(prev => Math.max(1, prev - 1))}
                      disabled={step === 1}
                      variant="ghost" 
                      className="rounded-xl border-slate-200 text-slate-600 font-bold gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Atrás
                    </Button>
                    
                    {step === 6 ? (
                      <Button 
                        onClick={consolidateTransaction}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl gap-2 cursor-pointer shadow-xs"
                      >
                        Consolidar Transacción
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          if (step === 2 && !analyzed) {
                            alert("Por favor ejecuta primero el análisis fitosanitario de AgroPulse IA.");
                            return;
                          }
                          setStep(prev => Math.min(7, prev + 1));
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl gap-1 cursor-pointer"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

              </Card>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
