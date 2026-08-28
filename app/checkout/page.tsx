"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { producerNames } from "@/lib/types";
import { getAllProducers } from "@/lib/data";
import { Producer } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2, 
  DollarSign, 
  Truck, 
  ArrowLeft,
  AlertTriangle,
  FileSignature
} from "lucide-react";

// Distritos permitidos en el norte
const DISTRITOS_ENTREGA = ["Motupe", "Olmos", "Jayanca", "Íllimo", "Chiclayo", "Lima"];

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DEL FORMULARIO DE CHECKOUT ---
  const [step, setStep] = useState(1); // 1: Carrito & Propuesta | 2: Logística & Contrato | 3: Éxito
  const [buyerName, setBuyerName] = useState("Importaciones Frutícolas S.A.");
  const [buyerRuc, setBuyerRuc] = useState("20458963251");
  const [deliveryDistrict, setDeliveryDistrict] = useState("Olmos");
  const [deliveryAddress, setDeliveryAddress] = useState("Av. Panamericana Norte Km. 104");
  const [incoterm, setIncoterm] = useState("EXW-Chacra");
  const [paymentMethod, setPaymentMethod] = useState("Transferencia-24h");
  const [contractAccepted, setContractAccepted] = useState(false);

  // --- ESTADOS DE LA NEGOCIACIÓN COMERCIAL ---
  // Precios negociados por cada item del carrito { [productId]: price }
  const [negotiatedPrices, setNegotiatedPrices] = useState<{ [key: string]: number }>({});
  const [proposalStatus, setProposalStatus] = useState<{ [key: string]: "idle" | "sending" | "accepted" | "countered" }>({});
  const [counterPrice, setCounterPrice] = useState<{ [key: string]: number }>({});

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

  // Inicializar precios negociados al cargar el carrito
  useEffect(() => {
    if (items.length > 0) {
      const prices: { [key: string]: number } = {};
      const status: { [key: string]: "idle" } = {};
      items.forEach(item => {
        if (!negotiatedPrices[item.id]) {
          prices[item.id] = item.price;
          status[item.id] = "idle";
        }
      });
      setNegotiatedPrices(prev => ({ ...prices, ...prev }));
      setProposalStatus(prev => ({ ...status, ...prev }));
    }
  }, [items]);

  const getProducer = (prodId: string) => {
    return producers.find(p => p.id === prodId);
  };

  // Verificar si hay algún vendedor no certificado por SENASA en el carrito
  const hasNonCertifiedProducer = items.some(item => {
    const p = getProducer(item.producerId);
    return p ? !p.senasaCertified : true;
  });

  // Simulación de envío de la propuesta comercial
  const submitPriceProposal = (itemId: string, proposedPrice: number, basePrice: number) => {
    setProposalStatus(prev => ({ ...prev, [itemId]: "sending" }));

    setTimeout(() => {
      // Regla de aceptación simulada:
      // Si el descuento propuesto es menor o igual al 15%, el agricultor acepta.
      // Si es mayor al 15%, el agricultor contra-oferta un 10% de descuento.
      const discountPercentage = ((basePrice - proposedPrice) / basePrice) * 100;
      
      if (proposedPrice <= 0 || proposedPrice > basePrice) {
        setNegotiatedPrices(prev => ({ ...prev, [itemId]: basePrice }));
        setProposalStatus(prev => ({ ...prev, [itemId]: "idle" }));
        return;
      }

      if (discountPercentage <= 15) {
        setNegotiatedPrices(prev => ({ ...prev, [itemId]: proposedPrice }));
        setProposalStatus(prev => ({ ...prev, [itemId]: "accepted" }));
      } else {
        const counter = parseFloat((basePrice * 0.9).toFixed(2)); // Contraoferta del 10% desc.
        setCounterPrice(prev => ({ ...prev, [itemId]: counter }));
        setNegotiatedPrices(prev => ({ ...prev, [itemId]: counter }));
        setProposalStatus(prev => ({ ...prev, [itemId]: "countered" }));
      }
    }, 1500);
  };

  // Calcular totales financieros
  const originalSubtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  const negotiatedSubtotal = items.reduce((sum, item) => {
    const price = negotiatedPrices[item.id] !== undefined ? negotiatedPrices[item.id] : item.price;
    return sum + price;
  }, 0);

  const totalAhorro = originalSubtotal - negotiatedSubtotal;

  // Costo de flete según Incoterm y distrito
  const getFleteCost = () => {
    if (incoterm === "EXW-Chacra") return 0;
    if (incoterm === "FCA-Acopio") return 120;
    
    const count = items.length;
    let baseRate = 5; // DAP default
    if (incoterm === "DDP-Destino") baseRate = 8;
    if (incoterm === "FOB-Planta") baseRate = 3;

    return count * baseRate * 10; // flete simulado por volumen de items
  };

  const fleteCost = getFleteCost();

  // Cargos locales extra para DDP
  const localTaxes = incoterm === "DDP-Destino" ? 85.0 : 0.0;

  // Total Final
  const finalTotal = negotiatedSubtotal + fleteCost + localTaxes;

  // Generar código de orden
  const orderCode = `MS-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCheckoutComplete = () => {
    if (!contractAccepted) {
      alert("Por favor acepta las cláusulas del contrato digital antes de concretar la transacción.");
      return;
    }
    setStep(3);
    clearCart(); // vaciar carrito al finalizar
  };

  if (loading) {
    return (
      <section className="w-full min-h-screen py-20 flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </section>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          
          {/* Cabecera y Pasos de Transacción */}
          <div className="mb-8 bg-white p-6 rounded-3xl shadow-xs border">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Pasarela B2B
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Orden de Compra
            </h1>
          </div>

          {items.length === 0 && step < 3 ? (
            <div className="bg-white rounded-3xl p-12 text-center border shadow-xs flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-slate-300 animate-bounce" />
              <h2 className="text-xl font-bold text-slate-800">Tu carrito de compras está vacío</h2>
              <p className="text-slate-500 text-sm max-w-md">No tienes ofertas agregadas para concretar una transacción. Explora nuestro catálogo de productores locales para añadir mangos.</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-2 cursor-pointer">
                <Link href="/">Ver Productores</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* --- COLUMNA DE DETALLES (IZQUIERDA) --- */}
              {step < 3 && (
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* PASO 1: PROPUESTA COMERCIAL Y AJUSTE DE PRECIO */}
                  {step === 1 && (
                    <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-6">
                      <div>
                        <h2 className="text-lg font-black text-slate-900">1. Ajuste Comercial & Propuesta de Precio</h2>
                        <p className="text-slate-500 text-xs mt-1">Como comprador B2B, puedes proponer un precio objetivo por cada lote de fruta. El productor decidirá si acepta o contra-oferta de inmediato.</p>
                      </div>

                      <div className="space-y-6">
                        {items.map((item) => {
                          const sellerName = producerNames[item.producerId] || "Productor Local";
                          const currentPrice = negotiatedPrices[item.id] !== undefined ? negotiatedPrices[item.id] : item.price;
                          const status = proposalStatus[item.id] || "idle";

                          return (
                            <div key={item.id} className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/40 space-y-4">
                              <div className="flex gap-4">
                                <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-150 flex-shrink-0">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-slate-800 text-sm">{item.name}</h4>
                                  <p className="text-[11px] text-slate-400 font-semibold">
                                    Vendedor: <span className="text-emerald-700">{sellerName}</span>
                                  </p>
                                  <p className="text-xs text-slate-550 font-bold">
                                    Precio Base: S/. {item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Formulario de Propuesta */}
                              <div className="border-t pt-3.5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <Label htmlFor={`prop-${item.id}`} className="text-slate-650 text-[10px] font-bold uppercase tracking-wider">Tu Propuesta de Precio B2B (S/.)</Label>
                                  <div className="relative max-w-[200px]">
                                    <span className="absolute left-3 top-2.5 text-slate-450 font-bold text-xs">S/.</span>
                                    <Input
                                      id={`prop-${item.id}`}
                                      type="number"
                                      step="0.1"
                                      disabled={status === "sending" || status === "accepted"}
                                      placeholder={item.price.toFixed(2)}
                                      className="pl-8.5 h-8.5 text-xs rounded-lg bg-white"
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setNegotiatedPrices(prev => ({ ...prev, [item.id]: val }));
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="flex-shrink-0">
                                  {status === "idle" && (
                                    <Button 
                                      onClick={() => submitPriceProposal(item.id, currentPrice, item.price)}
                                      className="h-8.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer px-4.5"
                                    >
                                      Enviar Propuesta
                                    </Button>
                                  )}

                                  {status === "sending" && (
                                    <span className="text-xs text-slate-400 font-semibold animate-pulse block pb-2">
                                      Evaluando propuesta...
                                    </span>
                                  )}

                                  {status === "accepted" && (
                                    <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Aceptado (S/. {currentPrice.toFixed(2)})
                                    </span>
                                  )}

                                  {status === "countered" && (
                                    <div className="text-right">
                                      <span className="text-[10px] text-amber-700 font-bold block bg-amber-50 px-2 py-1 rounded-md border border-amber-200 mb-1">
                                        Contraoferta: S/. {counterPrice[item.id]?.toFixed(2)}
                                      </span>
                                      <Button
                                        onClick={() => setProposalStatus(prev => ({ ...prev, [item.id]: "accepted" }))}
                                        className="h-7.5 bg-emerald-600 hover:bg-emerald-750 text-white font-bold rounded-lg text-[10px] px-3 cursor-pointer"
                                      >
                                        Aceptar Tarifa Mínima
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl text-xs text-slate-650 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">Manejo Comercial Directo:</p>
                          <p className="mt-0.5 leading-relaxed">
                            Una vez que estés conforme con los precios resultantes o aceptes las propuestas del productor, presiona "Siguiente" para configurar la logística de envío, Incoterms y redactar el contrato.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button 
                          onClick={() => setStep(2)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs gap-1.5 cursor-pointer"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* PASO 2: LOGÍSTICA, INCOTERM Y CONTRATACIÓN */}
                  {step === 2 && (
                    <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h2 className="text-lg font-black text-slate-900">2. Logística, Incoterms & Contrato Digital</h2>
                        <p className="text-slate-500 text-xs mt-1">Configura las condiciones de transporte y firma el Contrato de Compraventa Agrícola para validar legalmente tu pedido.</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Datos del Comprador</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="buyer-name" className="text-xs text-slate-650 font-semibold">Razón Social *</Label>
                            <Input
                              id="buyer-name"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              className="rounded-xl border-slate-200 text-xs h-9.5"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="buyer-ruc" className="text-xs text-slate-650 font-semibold">Número de RUC *</Label>
                            <Input
                              id="buyer-ruc"
                              value={buyerRuc}
                              onChange={(e) => setBuyerRuc(e.target.value)}
                              className="rounded-xl border-slate-200 text-xs h-9.5"
                            />
                          </div>
                        </div>

                        <Separator className="my-2" />

                        <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Destino de Entrega & Logística</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Distrito */}
                          <div className="space-y-1">
                            <Label htmlFor="deliv-dist" className="text-xs text-slate-650 font-semibold">Distrito de Entrega *</Label>
                            <select
                              id="deliv-dist"
                              value={deliveryDistrict}
                              onChange={(e) => setDeliveryDistrict(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-xs cursor-pointer focus:ring-1 focus:ring-emerald-500 h-9.5"
                            >
                              {DISTRITOS_ENTREGA.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>

                          {/* Dirección */}
                          <div className="space-y-1">
                            <Label htmlFor="deliv-address" className="text-xs text-slate-650 font-semibold">Dirección Exacta *</Label>
                            <Input
                              id="deliv-address"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="rounded-xl border-slate-200 text-xs h-9.5"
                            />
                          </div>

                          {/* Incoterm del Mango */}
                          <div className="space-y-1">
                            <Label htmlFor="deliv-incoterm" className="text-xs text-slate-650 font-semibold">Incoterm Pactado *</Label>
                            <select
                              id="deliv-incoterm"
                              value={incoterm}
                              onChange={(e) => setIncoterm(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-xs cursor-pointer focus:ring-1 focus:ring-emerald-500 h-9.5"
                            >
                              <option value="EXW-Chacra">EXW-Chacra (Recojo en finca - S/. 0 flete)</option>
                              <option value="FCA-Acopio">FCA-Acopio (Flat acopio local - S/. 120 flete)</option>
                              <option value="DAP-Destino">DAP-Destino (Flete por lote - S/. 5 por caja)</option>
                              <option value="DDP-Destino">DDP-Destino (Todo incluido - S/. 8 flete + arancel)</option>
                              
                              <option value="FOB-Planta" disabled={hasNonCertifiedProducer}>
                                FOB-Planta (Solo Vendedores SENASA)
                              </option>
                            </select>
                          </div>

                          {/* Método de Pago */}
                          <div className="space-y-1">
                            <Label htmlFor="pay-method" className="text-xs text-slate-650 font-semibold">Método de Liquidación *</Label>
                            <select
                              id="pay-method"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-xs cursor-pointer focus:ring-1 focus:ring-emerald-500 h-9.5"
                            >
                              <option value="Transferencia-24h">Transferencia Bancaria B2B (24 Horas)</option>
                              <option value="Contra-entrega">Pago contra entrega física</option>
                              <option value="Carta-Credito">Carta de Crédito Irrevocable (BCP)</option>
                            </select>
                          </div>
                        </div>

                        {/* Bloqueo FOB-Planta advertencia */}
                        {hasNonCertifiedProducer && (
                          <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-[11px] text-rose-800 flex items-start gap-2 mt-2">
                            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                            <p>
                              <strong>Incoterm FOB-Planta bloqueado:</strong> Tu carrito contiene productos de vendedores que no cuentan con Acreditación Fitosanitaria SENASA activa.
                            </p>
                          </div>
                        )}

                        <Separator className="my-2" />

                        {/* --- CONTRATO DE COMPRAVENTA DIGITAL --- */}
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FileSignature className="h-4 w-4 text-emerald-600" />
                            Contrato de Compraventa Agrícola
                          </h3>
                          
                          {/* Cuadro del Contrato */}
                          <div className="bg-slate-900 text-slate-350 p-4.5 rounded-2xl border font-mono text-[10px] leading-relaxed max-h-[220px] overflow-y-auto space-y-3">
                            <p className="text-center font-bold text-white border-b pb-2">CONTRATO DE COMPRAVENTA DE FRUTAS FRESCAS (MANGO KENT)</p>
                            
                            <p>
                              <strong>COMPRADOR:</strong> {buyerName} RUC N° {buyerRuc}.<br />
                              <strong>VENDEDOR(ES):</strong> {items.map(i => producerNames[i.producerId]).filter((v, idx, self) => self.indexOf(v) === idx).join(", ")}.
                            </p>

                            <p>
                              <strong>PRIMERA: OBJETO DEL CONTRATO.</strong> El Vendedor se compromete a transferir y entregar la cantidad de {items.length} lote(s) de mango Kent orgánico de descarte técnico controlado según los estándares del catálogo.
                            </p>

                            <p>
                              <strong>SEGUNDA: LOGÍSTICA E INCOTERM.</strong> Las partes pactan la entrega bajo las condiciones del Incoterm <strong>{incoterm}</strong> con destino en {deliveryAddress}, {deliveryDistrict}. El flete asignado asciende a S/. {fleteCost.toFixed(2)}.
                            </p>

                            <p>
                              <strong>TERCERA: PRECIOS Y FORMA DE PAGO.</strong> El precio final consolidado es de S/. {finalTotal.toFixed(2)}, el cual será cancelado mediante <strong>{paymentMethod === "Transferencia-24h" ? "Transferencia Bancaria a 24 horas" : paymentMethod === "Contra-entrega" ? "Pago contra entrega física" : "Carta de Crédito Irrevocable"}</strong>.
                            </p>
                            
                            <p className="text-[9px] text-slate-500 border-t pt-2">
                              Firma digitalizada de conformidad MangoSync OIDC Block.
                            </p>
                          </div>

                          {/* Checkbox Aceptación */}
                          <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <input 
                              type="checkbox" 
                              id="accept-contract"
                              checked={contractAccepted}
                              onChange={(e) => setContractAccepted(e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <Label htmlFor="accept-contract" className="text-xs text-slate-700 font-semibold cursor-pointer">
                              Declaro estar conforme y firmo digitalmente este contrato agrícola.
                            </Label>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <Button 
                          onClick={() => setStep(1)}
                          variant="ghost"
                          className="text-slate-500 font-bold text-xs gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Volver a Precios
                        </Button>

                        <Button 
                          onClick={handleCheckoutComplete}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs gap-1.5 cursor-pointer shadow-xs"
                        >
                          Concretar Transacción
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}

                </div>
              )}

              {/* --- PANEL LATERAL DE RESUMEN FINANCIERO (PASO 1 Y 2) --- */}
              {step < 3 && (
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Resumen de Productos */}
                  <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <div className="bg-slate-900 text-white p-5">
                      <h3 className="font-extrabold text-sm flex items-center gap-2">
                        <ShoppingBag className="h-4.5 w-4.5 text-emerald-400" />
                        Resumen de Lotes en Orden
                      </h3>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      {items.map((item) => {
                        const sellerName = producerNames[item.producerId] || "Vendedor";
                        const price = negotiatedPrices[item.id] !== undefined ? negotiatedPrices[item.id] : item.price;
                        const hasDiscount = price < item.price;

                        return (
                          <div key={item.id} className="flex justify-between items-start gap-4 border-b pb-3.5 last:border-b-0 last:pb-0">
                            <div>
                              <h5 className="font-bold text-slate-800 text-xs">{item.name}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">Vendedor: {sellerName}</p>
                            </div>
                            <div className="text-right">
                              {hasDiscount && (
                                <span className="text-[10px] text-slate-400 line-through block">
                                  S/. {item.price.toFixed(2)}
                                </span>
                              )}
                              <span className="font-extrabold text-slate-800 text-xs">
                                S/. {price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Resumen Financiero Total */}
                  <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-bold text-slate-850 text-sm">Resumen de Liquidación</h4>
                      
                      <div className="space-y-2 text-xs">
                        {/* Subtotal original */}
                        <div className="flex justify-between text-slate-500 font-semibold">
                          <span>Subtotal base</span>
                          <span>S/. {originalSubtotal.toFixed(2)}</span>
                        </div>

                        {/* Ahorro por propuesta */}
                        {totalAhorro > 0 && (
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>Ahorro por Propuesta Comercial</span>
                            <span>- S/. {totalAhorro.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Flete */}
                        <div className="flex justify-between text-slate-500 font-semibold">
                          <span>Flete Logístico ({incoterm})</span>
                          <span>S/. {fleteCost.toFixed(2)}</span>
                        </div>

                        {/* Impuestos locales DDP */}
                        {localTaxes > 0 && (
                          <div className="flex justify-between text-slate-500 font-semibold">
                            <span>Cargos arancelarios locales (DDP)</span>
                            <span>S/. {localTaxes.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Desglose Comisión de Vendedor */}
                        <div className="border-t pt-3 mt-1 space-y-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Incentivos de Comisión MangoSync (Vendedores)</p>
                          {items.map((item) => {
                            const p = getProducer(item.producerId);
                            if (!p) return null;
                            // Encontrar info de nivel
                            const baseComm = 10;
                            const currentComm = p.level === "Semilla" ? 10 : p.level === "Productor" ? 8 : p.level === "Avanzado" ? 6 : p.level === "Premium" ? 5 : 4;
                            const price = negotiatedPrices[item.id] !== undefined ? negotiatedPrices[item.id] : item.price;
                            const commissionSaved = (price * (baseComm - currentComm)) / 100;

                            return (
                              <div key={item.id} className="flex justify-between text-[11px] text-emerald-750 font-semibold">
                                <span>{p.name} ({p.level} {p.emoji} - {currentComm}%)</span>
                                <span>Comisión reducida</span>
                              </div>
                            );
                          })}
                        </div>

                      </div>

                      <Separator />

                      {/* Total Liquidación */}
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">Total Liquidación B2B</p>
                          <p className="text-slate-400 text-[10px]">A abonar según términos acordados</p>
                        </div>
                        <span className="text-emerald-700 font-black text-xl sm:text-2xl">
                          S/. {finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              )}

              {/* --- PASO 3: TRANSACCIÓN CONCRETADA (ÉXITO) --- */}
              {step === 3 && (
                <div className="lg:col-span-12 text-center py-10 max-w-xl mx-auto space-y-8 animate-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500 animate-pulse">
                      <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3.5xl font-black text-slate-950 mt-3">¡Transacción Concretada!</h2>
                    <p className="text-slate-500 text-sm">El Contrato de Compraventa ha sido firmado digitalmente y despachado de forma oficial.</p>
                  </div>

                  <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white p-6 space-y-4 text-sm text-left">
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-slate-450 font-semibold">Código de Transacción:</span>
                      <span className="text-slate-800 font-bold font-mono">{orderCode}</span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span className="text-slate-450 font-semibold">Monto de Liquidación B2B:</span>
                      <span className="text-emerald-700 font-extrabold">S/. {finalTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span className="text-slate-450 font-semibold">Términos Logísticos:</span>
                      <span className="text-slate-850 font-bold">{incoterm} - {deliveryDistrict}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-450 font-semibold">Forma de Pago Acordada:</span>
                      <span className="text-slate-850 font-bold">
                        {paymentMethod === "Transferencia-24h" && "Transferencia Bancaria (24 horas)"}
                        {paymentMethod === "Contra-entrega" && "Pago contra entrega"}
                        {paymentMethod === "Carta-Credito" && "Carta de Crédito Irrevocable"}
                      </span>
                    </div>
                  </Card>

                  {/* Instrucciones de Pago */}
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-xs text-left space-y-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-emerald-700" />
                      <h4 className="font-extrabold text-emerald-950">Próximos Pasos de Despacho</h4>
                    </div>
                    <ul className="space-y-1.5 text-slate-650 leading-relaxed list-disc pl-4.5">
                      <li>Hemos despachado copias del contrato digital en PDF firmado a los correos del comprador y del productor.</li>
                      {paymentMethod === "Transferencia-24h" && (
                        <li>Por favor realiza la transferencia a la Cuenta Corriente BCP de MangoSync: <strong>191-45896325-0-84</strong> e ingresa el comprobante en tu panel para liberar el flete.</li>
                      )}
                      <li>Los productores han recibido las órdenes de acopio y están programando la cosecha y el paletizado fitosanitario.</li>
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4 pt-2">
                    <Button asChild className="bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 px-6 rounded-xl text-xs cursor-pointer">
                      <Link href="/">Volver a la Portada</Link>
                    </Button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
