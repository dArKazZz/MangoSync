"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, Category } from "@/lib/types";
import {
  Edit2,
  Plus,
  Trash2,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  X,
  Lock,
  LogOut,
  Trophy,
  Award,
  Star,
  Clock,
  TrendingUp,
  GraduationCap,
  Coins,
  ShieldCheck,
  Zap,
  Bookmark
} from "lucide-react";
import Image from "next/image";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"catalog" | "incentives">("catalog");

  // Gamification & Sales State
  const [cajasVendidas, setCajasVendidas] = useState(350);
  const [bestFarmer, setBestFarmer] = useState(false);
  const [highGrowth, setHighGrowth] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [onTimeDelivery, setOnTimeDelivery] = useState(true);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("/images/product_ataulfo_box.png");

  // Check login on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("mangoSyncAuth");
    if (auth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Load database data from API routes
  const loadData = async () => {
    try {
      setLoading(true);
      const resProds = await fetch("/api/products", { cache: "no-store" });
      const resCats = await fetch("/api/categories", { cache: "no-store" });

      if (resProds.ok && resCats.ok) {
        const prodsData = await resProds.json();
        const catsData = await resCats.json();
        setProducts(prodsData.products);
        setCategories(catsData.categories.map((c: Category) => c.name));
      } else {
        showToast("Error al cargar los datos del catálogo", "error");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Error al conectar con la tienda", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Por favor, completa todos los campos.");
      return;
    }

    if (
      (email === "admin@mangosync.com" && password === "admin") ||
      (email === "felipe@mangosync.com" && password === "felipe")
    ) {
      sessionStorage.setItem("mangoSyncAuth", "true");
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("mangoSyncAuthChange"));
      showToast("Sesión iniciada con éxito", "success");
    } else {
      setLoginError("Credenciales incorrectas. Intenta con felipe@mangosync.com / felipe");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mangoSyncAuth");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("mangoSyncAuthChange"));
    showToast("Sesión cerrada", "info");
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory(categories[0] || "Fruta Fresca");
    setImage("/images/product_ataulfo_box.png");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      showToast("Por favor, completa los campos requeridos (*)", "error");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Por favor, introduce un precio válido", "error");
      return;
    }

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price: priceNum,
            category,
            image,
          }),
        });

        if (res.ok) {
          showToast("Producto actualizado con éxito", "success");
        } else {
          throw new Error("Failed to update");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price: priceNum,
            category,
            image,
          }),
        });

        if (res.ok) {
          showToast("Producto publicado con éxito", "success");
        } else {
          throw new Error("Failed to create");
        }
      }
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("No se pudo guardar el producto. Inténtalo de nuevo.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?")) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showToast("Producto eliminado con éxito", "success");
          loadData();
        } else {
          throw new Error("Failed to delete");
        }
      } catch (err) {
        console.error(err);
        showToast("No se pudo eliminar el producto", "error");
      }
    }
  };

  // Helper dynamic level computation
  const getLevelInfo = (cajas: number) => {
    if (cajas < 500) {
      return {
        name: "Semilla",
        emoji: "🌱",
        commission: 10,
        colorClass: "from-amber-400 to-amber-600 bg-amber-50 border-amber-200 text-amber-700",
        badgeClass: "bg-amber-100 text-amber-800 border border-amber-200",
        perk: "Acceso básico a la plataforma de ventas y soporte comunitario.",
        nextLevel: "Productor",
        nextEmoji: "🌿",
        nextThreshold: 500,
        prevThreshold: 0,
      };
    } else if (cajas < 1000) {
      return {
        name: "Productor",
        emoji: "🌿",
        commission: 8,
        colorClass: "from-emerald-400 to-emerald-600 bg-emerald-50 border-emerald-200 text-emerald-700",
        badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        perk: "Capacitación agrícola continua y talleres de cultivo sostenible gratuitos.",
        nextLevel: "Avanzado",
        nextEmoji: "🌳",
        nextThreshold: 1000,
        prevThreshold: 500,
      };
    } else if (cajas < 2000) {
      return {
        name: "Avanzado",
        emoji: "🌳",
        commission: 6,
        colorClass: "from-teal-400 to-teal-600 bg-teal-50 border-teal-200 text-teal-700",
        badgeClass: "bg-teal-100 text-teal-800 border border-teal-200",
        perk: "Asesoría técnica especializada personalizada para mejorar tus cosechas.",
        nextLevel: "Premium",
        nextEmoji: "🥭",
        nextThreshold: 2000,
        prevThreshold: 1000,
      };
    } else if (cajas < 3000) {
      return {
        name: "Premium",
        emoji: "🥭",
        commission: 5,
        colorClass: "from-orange-400 to-orange-600 bg-orange-50 border-orange-200 text-orange-700",
        badgeClass: "bg-orange-100 text-orange-800 border border-orange-200",
        perk: "Beneficios de prioridad logística, envíos express y distribución preferencial.",
        nextLevel: "Élite",
        nextEmoji: "👑",
        nextThreshold: 3000,
        prevThreshold: 2000,
      };
    } else {
      return {
        name: "Élite",
        emoji: "👑",
        commission: 4,
        colorClass: "from-yellow-400 to-yellow-600 bg-yellow-50 border-yellow-200 text-yellow-700",
        badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        perk: "Acceso completo a bonos económicos anuales y premios de temporada.",
        nextLevel: null,
        nextEmoji: null,
        nextThreshold: null,
        prevThreshold: 3000,
      };
    }
  };

  const levelInfo = getLevelInfo(cajasVendidas);
  const totalProducts = products.length;

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 text-white text-center p-8 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-xs">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-extrabold tracking-tight">Acceso de Agricultor / Productor</CardTitle>
              <CardDescription className="text-amber-100/90 mt-1 text-xs">
                Ingresa a tu cuenta de MangoSync para administrar los productos de tu finca.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="p-8 space-y-6">
                
                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-650 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="felipe@mangosync.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-slate-200 p-5 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-slate-200 p-5 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    required
                  />
                </div>

                <div className="text-xs text-slate-450 bg-slate-50 p-3 rounded-xl text-center leading-relaxed">
                  💡 **Credenciales demo:**  
                  Correo: <span className="font-semibold text-slate-700">felipe@mangosync.com</span>  
                  Contraseña: <span className="font-semibold text-slate-700">felipe</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-6 rounded-xl hover:shadow-lg transition-all border-none cursor-pointer"
                >
                  Iniciar Sesión
                </Button>

              </CardContent>
            </form>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-400"
                : toast.type === "error"
                ? "bg-rose-500/90 text-white border-rose-400"
                : "bg-amber-500/90 text-white border-amber-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 shrink-0" />}
              {toast.type === "info" && <Sparkles className="h-5 w-5 shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/80 hover:text-white ml-4 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-slate-50/50 py-10">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Header Profile Dashboard */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-3xl p-6 md:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-sm">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight font-sans">Don Felipe Flores</h1>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-900/60 rounded-full border border-emerald-400">Productor Asociado</span>
                  </div>
                  <p className="text-amber-100 font-medium text-sm md:text-base max-w-xl">
                    Productor de mango Kent de exportación en la Finca San José en Motupe, Lambayeque. Cosechando fruta premium y derivados agroindustriales desde hace más de 12 años.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={handleOpenAddModal}
                  className="bg-white text-emerald-950 hover:bg-amber-100 font-bold px-6 py-6 rounded-2xl shadow-lg transition-transform active:scale-95 border-none cursor-pointer"
                >
                  <Plus className="mr-2 h-5 w-5" /> Agregar Producto
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold p-6 rounded-2xl shadow-lg shrink-0 cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid - Now Dynamically linked to Incentives! */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Productos Activos</p>
                  <h3 className="text-4xl font-extrabold text-slate-800 mt-2">{totalProducts}</h3>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mi Comisión de Ventas</p>
                  <h3 className="text-4xl font-extrabold text-emerald-600 mt-2">{levelInfo.commission}%</h3>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Coins className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mi Nivel Actual</p>
                  <h3 className="text-3xl font-extrabold text-amber-500 mt-3.5 flex items-center gap-1.5">
                    <span>{levelInfo.emoji}</span>
                    <span>{levelInfo.name}</span>
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Award className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs and Content wrapped in B2B Sponsor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Columna Principal: Gestión del Negocio */}
            <div className="lg:col-span-9 space-y-6">
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 mb-8 gap-4">
                <button
                  onClick={() => setActiveTab("catalog")}
                  className={`pb-4 text-base font-bold transition-all px-2 relative cursor-pointer ${
                    activeTab === "catalog"
                      ? "text-emerald-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Catálogo de Productos
                  {activeTab === "catalog" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("incentives")}
                  className={`pb-4 text-base font-bold transition-all px-2 relative cursor-pointer flex items-center gap-2 ${
                    activeTab === "incentives"
                      ? "text-emerald-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Trophy className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
                  Nivel e Incentivos
                  {activeTab === "incentives" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"></div>
                  )}
                </button>
              </div>

              {/* Tab 1: Product Catalog CRUD */}
              {activeTab === "catalog" && (
                <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                  <CardHeader className="border-b border-slate-100 p-6">
                    <CardTitle className="text-xl font-bold text-slate-800">Mi Catálogo de Productos</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">Agrega, edita o elimina productos del inventario de tu tienda.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No hay productos en catálogo</h3>
                        <p className="text-slate-400 mt-1 max-w-sm mx-auto">Comienza agregando tu primer mango fresco o subproducto.</p>
                        <Button onClick={handleOpenAddModal} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                          <Plus className="mr-2 h-4 w-4" /> Agregar Primer Producto
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase border-b border-slate-100">
                              <th className="p-4 px-6">Imagen</th>
                              <th className="p-4 px-6">Producto</th>
                              <th className="p-4 px-6">Categoría</th>
                              <th className="p-4 px-6 text-right">Precio</th>
                              <th className="p-4 px-6 text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 px-6">
                                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-100">
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </td>
                                <td className="p-4 px-6">
                                  <div className="font-semibold text-slate-800">{product.name}</div>
                                  <div className="text-slate-400 text-xs truncate max-w-xs md:max-w-md">{product.description}</div>
                                </td>
                                <td className="p-4 px-6">
                                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="p-4 px-6 text-right font-bold text-slate-800">
                                  S/. {product.price.toFixed(2)}
                                </td>
                                <td className="p-4 px-6">
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      onClick={() => handleOpenEditModal(product)}
                                      variant="ghost"
                                      size="icon"
                                      className="text-slate-500 hover:text-amber-600 hover:bg-amber-50 h-9 w-9 rounded-lg cursor-pointer"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDelete(product.id)}
                                      variant="ghost"
                                      size="icon"
                                      className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-9 w-9 rounded-lg cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tab 2: Gamification Progress & Incentives Dashboard */}
              {activeTab === "incentives" && (
                <div className="space-y-8 animate-in fade-in-50 duration-300">
                  
                  {/* Grid: Current Level Progress & Sales Simulator */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Panel 1: Current Level info (Spans 2 cols on lg) */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden lg:col-span-2">
                      <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-500" /> Mi Nivel y Beneficios
                        </CardTitle>
                        <CardDescription>Visualiza tu nivel actual, beneficios y tu meta para el siguiente nivel.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* Big Level Display Badges */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-600 flex items-center justify-center text-4xl shadow-md text-white shrink-0">
                            {levelInfo.emoji}
                          </div>
                          <div className="text-center sm:text-left space-y-1">
                            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                              <h4 className="text-2xl font-extrabold text-slate-850">Nivel {levelInfo.name}</h4>
                              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${levelInfo.badgeClass}`}>
                                Comisión: {levelInfo.commission}%
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                              <strong className="text-slate-700">Beneficio Activo:</strong> {levelInfo.perk}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar towards next tier */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="text-slate-500">Progreso de Ventas</span>
                            <span className="text-slate-700">
                              {cajasVendidas} {levelInfo.nextThreshold ? `/ ${levelInfo.nextThreshold}` : ""} cajas vendidas
                            </span>
                          </div>
                          
                          {/* Bar Container */}
                          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden relative">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${
                                  levelInfo.nextThreshold
                                    ? Math.min(
                                        ((cajasVendidas - levelInfo.prevThreshold) /
                                          (levelInfo.nextThreshold - levelInfo.prevThreshold)) *
                                          100,
                                        100
                                      )
                                    : 100
                                }%`,
                              }}
                            ></div>
                          </div>

                          {/* Guide Text */}
                          {levelInfo.nextThreshold ? (
                            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 text-amber-800 text-xs font-semibold flex items-center gap-2">
                              <Zap className="h-4 w-4 shrink-0 text-amber-500 animate-pulse" />
                              <span>
                                ¡Te faltan <strong>{levelInfo.nextThreshold - cajasVendidas} cajas</strong> para alcanzar el <strong>Nivel {levelInfo.nextLevel} {levelInfo.nextEmoji}</strong> y reducir tu comisión a <strong>{levelInfo.commission - 2}%</strong>!
                              </span>
                            </div>
                          ) : (
                            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-xs font-semibold flex items-center gap-2">
                              <Trophy className="h-4.5 w-4.5 shrink-0 text-yellow-500 fill-yellow-500/10" />
                              <span>¡Felicidades! Has alcanzado el nivel de ventas máximo de agricultor. Tienes la comisión preferencial del 4%.</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Panel 2: Interactive Sales Simulator */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-amber-500" /> Simulador de Ventas
                        </CardTitle>
                        <CardDescription>Simula ventas acumuladas de cajas para probar cómo cambian los niveles en tiempo real.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="range-cajas" className="text-slate-650 font-bold text-sm">Cajas Vendidas: {cajasVendidas}</Label>
                          <input
                            id="range-cajas"
                            type="range"
                            min="0"
                            max="4000"
                            step="25"
                            value={cajasVendidas}
                            onChange={(e) => setCajasVendidas(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <div className="flex justify-between text-slate-400 text-xxs font-bold uppercase tracking-wider">
                            <span>0 Cajas</span>
                            <span>2000 (Premium)</span>
                            <span>4000 (Elite)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => setCajasVendidas((prev) => Math.min(prev + 100, 4000))}
                            variant="outline"
                            className="rounded-xl border-slate-200 font-semibold text-xs py-5 cursor-pointer"
                          >
                            +100 Cajas
                          </Button>
                          <Button
                            onClick={() => setCajasVendidas((prev) => Math.min(prev + 500, 4000))}
                            variant="outline"
                            className="rounded-xl border-slate-200 font-semibold text-xs py-5 cursor-pointer"
                          >
                            +500 Cajas
                          </Button>
                        </div>

                        <Button
                          onClick={() => setCajasVendidas(350)}
                          variant="ghost"
                          className="w-full text-slate-450 hover:text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Reiniciar (350 cajas)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section: Levels Roadmap */}
                  <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" /> Beneficios por Niveles de Venta
                      </CardTitle>
                      <CardDescription>Plan de crecimiento de comisiones decrecientes de MangoSync.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {[
                          { name: "Semilla", rate: "10%", cap: "0+", emoji: "🌱", color: "border-amber-250 bg-amber-50/30 text-amber-800" },
                          { name: "Productor", rate: "8%", cap: "500+", emoji: "🌿", color: "border-emerald-250 bg-emerald-50/30 text-emerald-800" },
                          { name: "Avanzado", rate: "6%", cap: "1000+", emoji: "🌳", color: "border-teal-250 bg-teal-50/30 text-teal-800" },
                          { name: "Premium", rate: "5%", cap: "2000+", emoji: "🥭", color: "border-orange-250 bg-orange-50/30 text-orange-800" },
                          { name: "Élite", rate: "4%", cap: "3000+", emoji: "👑", color: "border-yellow-250 bg-yellow-50/30 text-yellow-800" },
                        ].map((step, index) => {
                          const isActive = levelInfo.name === step.name;
                          const salesThreshold = parseInt(step.cap);
                          const isCompleted = cajasVendidas >= salesThreshold;
                          
                          return (
                            <div
                              key={step.name}
                              className={`p-4.5 rounded-2xl border transition-all flex flex-col items-center text-center space-y-2 relative overflow-hidden ${
                                isActive
                                  ? `ring-2 ring-emerald-600 shadow-md ${step.color}`
                                  : isCompleted
                                  ? `opacity-80 border-slate-200 bg-slate-50 text-slate-700`
                                  : `opacity-40 border-slate-100 bg-slate-50/30 text-slate-400`
                              }`}
                            >
                              {/* Completed check badge */}
                              {isCompleted && (
                                <div className="absolute top-2 right-2 h-4.5 w-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">
                                  ✓
                                </div>
                              )}

                              <div className="text-3xl">{step.emoji}</div>
                              <div>
                                <h5 className="font-extrabold text-sm">{step.name}</h5>
                                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wide mt-0.5">{step.cap} Cajas</p>
                              </div>
                              <div className="text-xl font-black text-slate-800">{step.rate}</div>
                              <div className="text-xxs text-slate-400 font-semibold">comisión</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section: Achievements & Quality Challenges */}
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-amber-500 fill-amber-500/10" /> Logros e Incentivos Adicionales
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          Desbloquea reconocimientos y beneficios extras cumpliendo metas de ventas y desafíos de calidad.
                        </p>
                      </div>
                      
                      {/* Qualitative toggles simulation area */}
                      <div className="flex flex-wrap gap-2.5 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                        <span className="text-xs font-bold text-slate-500 py-1.5 px-2 shrink-0">Simular Variables:</span>
                        <button
                          onClick={() => setBestFarmer(!bestFarmer)}
                          className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all border cursor-pointer ${
                            bestFarmer
                              ? "bg-amber-50 border-amber-250 text-amber-700"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          🏆 Agricultor del Mes: {bestFarmer ? "Sí" : "No"}
                        </button>
                        <button
                          onClick={() => setHighGrowth(!highGrowth)}
                          className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all border cursor-pointer ${
                            highGrowth
                              ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          📈 Alto Crecimiento: {highGrowth ? "Sí" : "No"}
                        </button>
                        <button
                          onClick={() => setHighQuality(!highQuality)}
                          className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all border cursor-pointer ${
                            highQuality
                              ? "bg-teal-50 border-teal-250 text-teal-700"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          ✨ Alta Calidad Fruta: {highQuality ? "Sí" : "No"}
                        </button>
                        <button
                          onClick={() => setOnTimeDelivery(!onTimeDelivery)}
                          className={`px-3 py-1.5 rounded-xl text-xxs font-bold transition-all border cursor-pointer ${
                            onTimeDelivery
                              ? "bg-blue-50 border-blue-250 text-blue-700"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          ⏱️ Logística Puntual: {onTimeDelivery ? "Sí" : "No"}
                        </button>
                      </div>
                    </div>

                    {/* Achievements Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      {/* Achievement 1 */}
                      <AchievementCard
                        unlocked={cajasVendidas >= 500}
                        icon={<Bookmark className="h-6 w-6 text-orange-500" />}
                        title="Primer Hito (500 Cajas)"
                        description="Alcanza tus primeras 500 cajas vendidas."
                        reward="Primer reconocimiento oficial y medalla en perfil."
                        progress={cajasVendidas}
                        target={500}
                      />

                      {/* Achievement 2 */}
                      <AchievementCard
                        unlocked={cajasVendidas >= 1000}
                        icon={<GraduationCap className="h-6 w-6 text-emerald-500" />}
                        title="Educación Continua"
                        description="Supera las 1,000 cajas vendidas."
                        reward="Acceso gratuito a curso agrícola orgánico avanzado."
                        progress={cajasVendidas}
                        target={1000}
                      />

                      {/* Achievement 3 */}
                      <AchievementCard
                        unlocked={cajasVendidas >= 2000}
                        icon={<ShieldCheck className="h-6 w-6 text-teal-500" />}
                        title="Asesoría Especializada"
                        description="Supera las 2,000 cajas vendidas."
                        reward="Visita de asesor técnico especializado uno-a-uno."
                        progress={cajasVendidas}
                        target={2000}
                      />

                      {/* Achievement 4 */}
                      <AchievementCard
                        unlocked={cajasVendidas >= 3000}
                        icon={<Coins className="h-6 w-6 text-yellow-500" />}
                        title="Bono de Cosecha"
                        description="Hito de ventas de 3,000 cajas."
                        reward="Bono económico de temporada y trofeo físico."
                        progress={cajasVendidas}
                        target={3000}
                      />

                      {/* Achievement 5 */}
                      <AchievementCard
                        unlocked={bestFarmer}
                        icon={<Trophy className="h-6 w-6 text-amber-500 fill-amber-500/10" />}
                        title="Agricultor del Mes"
                        description="Destacado por rendimiento y comunidad."
                        reward="Premio de temporada y banner en portada."
                        progress={bestFarmer ? 1 : 0}
                        target={1}
                        isQualitative
                      />

                      {/* Achievement 6 */}
                      <AchievementCard
                        unlocked={highGrowth}
                        icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
                        title="Crecimiento Estelar"
                        description="Mayor crecimiento mensual acumulado."
                        reward="Descuento especial en insumos agrícolas."
                        progress={highGrowth ? 1 : 0}
                        target={1}
                        isQualitative
                      />

                      {/* Achievement 7 */}
                      <AchievementCard
                        unlocked={highQuality}
                        icon={<Star className="h-6 w-6 text-red-500 fill-red-500/10" />}
                        title="Calidad Estrella"
                        description="Fruta evaluada con máxima calidad."
                        reward="Sello 'Calidad MangoSync' destacado."
                        progress={highQuality ? 1 : 0}
                        target={1}
                        isQualitative
                      />

                      {/* Achievement 8 */}
                      <AchievementCard
                        unlocked={onTimeDelivery}
                        icon={<Clock className="h-6 w-6 text-blue-500" />}
                        title="Entrega de Oro"
                        description="Entregas logísticas puntuales a clientes."
                        reward="Prioridad de recogida y despacho de cajas."
                        progress={onTimeDelivery ? 1 : 0}
                        target={1}
                        isQualitative
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Columna Lateral: Proveedores Recomendados (Anuncios Alquilados - Monetización) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-extrabold text-sm text-slate-800">Proveedores Recomendados</h3>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold">Patrocinado</span>
                </div>
                <p className="text-xxs text-slate-400 font-semibold leading-relaxed uppercase tracking-wider">
                  Espacios publicitarios alquilados para proveedores del sector agrícola.
                </p>

                {/* Banner 1: Fertilizantes BioCrec */}
                <Card className="border border-amber-200/60 shadow-none rounded-2xl overflow-hidden bg-amber-50/15">
                  <div className="p-3 bg-amber-500/10 text-amber-900 text-[9px] font-bold tracking-wider flex justify-between items-center border-b border-amber-200/20 uppercase">
                    <span>Nutrición Foliar</span>
                    <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded text-[7px] font-black">Alquilado</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-150 border">
                      <Image
                        src="https://images.unsplash.com/photo-1605000797439-7571d3cc4a21?auto=format&fit=crop&q=80&w=300"
                        alt="BioCrec Fertilizantes"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-850 text-xs">BioCrec Mango Kent</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Abono orgánico certificado para uniformizar la floración y aumentar calibre.
                      </p>
                    </div>
                    <Button 
                      onClick={() => alert("Redirigiendo a tienda aliada BioCrec...")}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[10px] py-1.5 h-8 cursor-pointer border-none"
                    >
                      Cotizar Insumos
                    </Button>
                  </CardContent>
                </Card>

                {/* Banner 2: HidroRain Riego */}
                <Card className="border border-emerald-200/60 shadow-none rounded-2xl overflow-hidden bg-emerald-50/15">
                  <div className="p-3 bg-emerald-500/10 text-emerald-900 text-[9px] font-bold tracking-wider flex justify-between items-center border-b border-emerald-200/20 uppercase">
                    <span>Riego Tecnificado</span>
                    <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[7px] font-black">Alquilado</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-150 border">
                      <Image
                        src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=300"
                        alt="HidroRain Riego"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-850 text-xs">HidroRain Goteo</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Sistemas de goteo automatizados. Ahorra hasta 40% de agua contra sequías.
                      </p>
                    </div>
                    <Button 
                      onClick={() => alert("Redirigiendo a HidroRain Perú...")}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] py-1.5 h-8 cursor-pointer border-none"
                    >
                      Ver Catálogo Riego
                    </Button>
                  </CardContent>
                </Card>

                {/* Banner 3: Jabas Plásticas Motupe */}
                <Card className="border border-slate-200 shadow-none rounded-2xl overflow-hidden bg-slate-50/50">
                  <div className="p-3 bg-slate-100 text-slate-800 text-[9px] font-bold tracking-wider flex justify-between items-center border-b border-slate-200/45 uppercase">
                    <span>Cosecha y Jabas</span>
                    <span className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[7px] font-black">Alquilado</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-150 border">
                      <Image
                        src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=300"
                        alt="Jabas Plásticas"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-850 text-xs">Jabas Motupe</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Cajas plásticas reforzadas de alta densidad para acopio. Pedidos por millar.
                      </p>
                    </div>
                    <Button 
                      onClick={() => alert("Redirigiendo a Jabas Cosecheras...")}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-[10px] py-1.5 h-8 cursor-pointer border-none"
                    >
                      Cotizar Jabas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add/Edit Product Modal Dialog Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 relative">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {editingProduct ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingProduct ? "Editar Producto de Mango" : "Agregar Nuevo Producto"}
              </CardTitle>
              <CardDescription className="text-amber-100/90 mt-1 text-xs">
                {editingProduct ? "Modifica los detalles del producto de mango seleccionado." : "Completa la información para publicar el nuevo producto."}
              </CardDescription>
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white rounded-full p-1 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-4">
                
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="prod-name" className="text-slate-700 font-semibold text-sm">Nombre del Producto *</Label>
                  <Input
                    id="prod-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Tiras de Mango Deshidratado Premium"
                    className="rounded-xl border-slate-200"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="prod-desc" className="text-slate-700 font-semibold text-sm">Descripción</Label>
                  <textarea
                    id="prod-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Proporciona una descripción detallada de este producto..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
                    rows={3}
                  />
                </div>

                {/* Category & Price Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prod-cat" className="text-slate-700 font-semibold text-sm">Categoría *</Label>
                    <select
                      id="prod-cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prod-price" className="text-slate-700 font-semibold text-sm">Precio (S/.) *</Label>
                    <Input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ej. 24.90"
                      className="rounded-xl border-slate-200"
                      required
                    />
                  </div>
                </div>

                {/* Image Selection Selector */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-sm">Imagen Demostrativa *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { url: "/images/product_ataulfo_box.png", label: "Fruta Fresca" },
                      { url: "/images/product_mango_nectar.png", label: "Jugo / Néctar" },
                      { url: "/images/product_dried_mango.png", label: "Deshidratado" },
                      { url: "/images/product_mango_jam.png", label: "Mermelada" },
                      { url: "/images/product_body_butter.png", label: "Cuidado Personal" },
                    ].map((imgOpt) => (
                      <button
                        key={imgOpt.url}
                        type="button"
                        onClick={() => setImage(imgOpt.url)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          image === imgOpt.url
                            ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/20"
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-white">
                          <Image src={imgOpt.url} alt={imgOpt.label} fill className="object-cover" />
                        </div>
                        <span>{imgOpt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </CardContent>
              <div className="bg-slate-50 p-4 px-6 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border-slate-200 text-slate-500 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 cursor-pointer"
                >
                  {editingProduct ? "Guardar Cambios" : "Publicar Producto"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </>
  );
}

interface AchievementCardProps {
  unlocked: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  reward: string;
  progress: number;
  target: number;
  isQualitative?: boolean;
}

function AchievementCard({
  unlocked,
  icon,
  title,
  description,
  reward,
  progress,
  target,
  isQualitative = false,
}: AchievementCardProps) {
  return (
    <Card
      className={`border transition-all overflow-hidden flex flex-col justify-between ${
        unlocked
          ? "border-emerald-200 bg-white shadow-xs"
          : "border-slate-100 bg-slate-50/50 opacity-70"
      }`}
    >
      <div className="p-5 space-y-3">
        {/* Header Icon + Checkmark */}
        <div className="flex justify-between items-start">
          <div
            className={`p-3 rounded-2xl ${
              unlocked ? "bg-emerald-50" : "bg-slate-100"
            }`}
          >
            {icon}
          </div>
          {unlocked ? (
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-full border border-emerald-250">
              Desbloqueado
            </span>
          ) : (
            <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-1">
              🔒 Bloqueado
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-slate-400 text-xxs font-medium leading-relaxed">{description}</p>
        </div>

        {/* Progress Bar (Only for quantitative targets) */}
        {!isQualitative && !unlocked && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Progreso:</span>
              <span>
                {progress} / {target}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Rewards Footer block */}
      <div
        className={`p-4 border-t text-xxs leading-relaxed font-semibold ${
          unlocked
            ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
            : "bg-slate-100/50 border-slate-150 text-slate-500"
        }`}
      >
        🎁 <strong className="text-slate-700 font-bold">Incentivo:</strong> {reward}
      </div>
    </Card>
  );
}
