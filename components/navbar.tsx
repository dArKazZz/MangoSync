"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import CartSheet from "./cart-sheet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";

/**
 * El componente de navegación principal.
 */
export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Comprobar estado de login y escuchar eventos de cambio
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        setIsLoggedIn(sessionStorage.getItem("mangoSyncAuth") === "true");
      }
    };
    checkAuth();

    window.addEventListener("mangoSyncAuthChange", checkAuth);
    return () => {
      window.removeEventListener("mangoSyncAuthChange", checkAuth);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Rutas centrales de navegación (excluyendo el perfil del comercio)
  const routes = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/categories", label: "Categorías" },
    { href: "/simulador", label: "Simulador de Innovación" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">

        {/* Navegación Móvil */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Alternar menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-sm text-bold hidden">Menú</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8 px-12">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
                <Link
                  href="/profile"
                  className="text-lg font-bold text-emerald-700 transition-colors hover:text-emerald-800 border-t border-slate-100 pt-4"
                >
                  {isLoggedIn ? "Panel de Control" : "Iniciar Sesión"}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logotipo */}
        <Link className="flex items-center gap-2.5 ml-4 md:ml-0 md:mr-8" href="/">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src="/images/logo_emblem.png"
              alt="Logo MangoSync"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-extrabold text-xl text-emerald-900 tracking-tight">
            Mango<span className="text-amber-500">Sync</span>
          </span>
        </Link>

        {/* Enlaces de Navegación Centrales */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="font-semibold text-slate-600 transition-colors hover:text-emerald-700"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Búsqueda, Acceso y Carrito */}
        <div className="flex items-center gap-4 ml-auto px-4 md:px-0">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full md:w-[200px] lg:w-[300px] pl-8 rounded-xl border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Búsqueda Móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Botón de Acceso de Administrador / Iniciar Sesión */}
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-xl border-slate-200 cursor-pointer"
          >
            <Link href="/profile" title={isLoggedIn ? "Panel de Control" : "Iniciar Sesión"}>
              <User className={`h-5 w-5 transition-colors ${isLoggedIn ? "text-emerald-600 fill-emerald-600/10" : "text-slate-500"}`} />
              <span className="sr-only">Acceder</span>
            </Link>
          </Button>

          {/* Carrito Lateral */}
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
