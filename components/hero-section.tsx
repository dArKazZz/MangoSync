"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  gradientClass: string;
}

const slides: Slide[] = [
  {
    badge: "Cosecha de Frescura",
    title: "Mangos Orgánicos de Temporada",
    description: "Del campo a tu hogar. Descubre nuestros mangos frescos variedad Kent de calidad de exportación, cultivados con amor y cosechados en su punto óptimo de madurez.",
    buttonText: "Ver Fruta Fresca",
    link: "/categories/fruta-fresca",
    gradientClass: "from-amber-400 via-orange-400 to-amber-500",
  },
  {
    badge: "Delicias Gourmet",
    title: "Mermeladas, Chutneys y Chamoy",
    description: "Productos artesanales elaborados en pequeños lotes con fruta 100% natural. Una explosión de sabor dulce, ácido y picante para tus comidas y botanas.",
    buttonText: "Ver Gourmet y Salsas",
    link: "/categories/mermeladas-y-salsas",
    gradientClass: "from-orange-500 via-red-500 to-amber-600",
  },
  {
    badge: "Cuidado y Bienestar",
    title: "Cosmética Natural de Mango",
    description: "Consiente tu piel con el poder del mango. Jabones exfoliantes y cremas corporales ultra-hidratantes formuladas con manteca pura de semilla de mango.",
    buttonText: "Ver Cuidado Personal",
    link: "/categories/cuidado-personal",
    gradientClass: "from-emerald-500 via-teal-600 to-amber-500",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play cycling every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden h-[420px] sm:h-[480px] md:h-[550px] lg:h-[600px] bg-slate-100">
      
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ease-in-out bg-gradient-to-br ${
              slide.gradientClass
            } ${
              idx === current
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-4 -z-10"
            }`}
          >
            {/* Overlay Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Slide Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-12 flex flex-col items-center text-center max-w-4xl">
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-emerald-950 bg-amber-200/90 rounded-full uppercase shadow-sm">
                  {slide.badge}
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm leading-tight">
                  {slide.title}
                </h1>
                <p className="mx-auto max-w-2xl text-amber-50 text-sm sm:text-base md:text-lg font-medium drop-shadow-sm leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Call to action button */}
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-12 duration-700">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold border-none shadow-lg transition-transform hover:scale-105 rounded-full px-8 py-6"
                >
                  <Link href={slide.link}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors hover:scale-105"
        aria-label="Diapositiva anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors hover:scale-105"
        aria-label="Siguiente diapositiva"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;